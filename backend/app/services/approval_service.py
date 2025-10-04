from sqlalchemy.orm import Session
from app.models.expense import Expense, ExpenseStatus
from app.models.approval import Approval, ApprovalRule, ApprovalWorkflow, ApprovalStatus, ApprovalRuleType
from app.models.user import User
from typing import List
from datetime import datetime

class ApprovalService:
    def __init__(self):
        pass
    
    async def start_approval_workflow(self, expense: Expense, db: Session):
        """Start approval workflow for an expense."""
        # Get applicable approval rule
        rule = self._get_applicable_rule(expense, db)
        if not rule:
            # No approval required
            expense.status = ExpenseStatus.APPROVED
            return
        
        # Create approval workflow
        workflow = ApprovalWorkflow(
            expense_id=expense.id,
            rule_id=rule.id,
            total_steps=self._calculate_total_steps(rule, expense)
        )
        db.add(workflow)
        db.flush()
        
        # Create approval records
        await self._create_approval_records(workflow, rule, expense, db)
        
        # Update expense status
        expense.status = ExpenseStatus.PENDING_APPROVAL
    
    def _get_applicable_rule(self, expense: Expense, db: Session) -> ApprovalRule:
        """Get applicable approval rule for expense."""
        # For now, get the first active rule for the company
        # In a real system, this would be more sophisticated
        rule = db.query(ApprovalRule).filter(
            ApprovalRule.company_id == expense.company_id,
            ApprovalRule.is_active == True
        ).first()
        
        return rule
    
    def _calculate_total_steps(self, rule: ApprovalRule, expense: Expense) -> int:
        """Calculate total steps in approval workflow."""
        if rule.requires_manager_approval:
            return len(rule.approvers) + 1  # +1 for manager
        return len(rule.approvers)
    
    async def _create_approval_records(self, workflow: ApprovalWorkflow, rule: ApprovalRule, expense: Expense, db: Session):
        """Create approval records for workflow."""
        # Get manager if required
        manager = None
        if rule.requires_manager_approval:
            manager = db.query(User).filter(
                User.id == expense.submitter.reporting_manager_id
            ).first()
        
        # Create approvals based on rule type
        if rule.rule_type == ApprovalRuleType.SEQUENTIAL:
            await self._create_sequential_approvals(workflow, rule, manager, db)
        elif rule.rule_type == ApprovalRuleType.PARALLEL:
            await self._create_parallel_approvals(workflow, rule, manager, db)
        elif rule.rule_type == ApprovalRuleType.PERCENTAGE:
            await self._create_percentage_approvals(workflow, rule, manager, db)
        else:
            # Default to parallel
            await self._create_parallel_approvals(workflow, rule, manager, db)
    
    async def _create_sequential_approvals(self, workflow: ApprovalWorkflow, rule: ApprovalRule, manager: User, db: Session):
        """Create sequential approval records."""
        step = 1
        
        # Manager approval first if required
        if rule.requires_manager_approval and manager:
            approval = Approval(
                expense_id=workflow.expense_id,
                approver_id=manager.id,
                workflow_id=workflow.id,
                status=ApprovalStatus.PENDING
            )
            db.add(approval)
            step += 1
        
        # Then rule approvers in sequence
        for approver in rule.approvers:
            approval = Approval(
                expense_id=workflow.expense_id,
                approver_id=approver.approver_id,
                workflow_id=workflow.id,
                status=ApprovalStatus.PENDING
            )
            db.add(approval)
    
    async def _create_parallel_approvals(self, workflow: ApprovalWorkflow, rule: ApprovalRule, manager: User, db: Session):
        """Create parallel approval records."""
        # Manager approval if required
        if rule.requires_manager_approval and manager:
            approval = Approval(
                expense_id=workflow.expense_id,
                approver_id=manager.id,
                workflow_id=workflow.id,
                status=ApprovalStatus.PENDING
            )
            db.add(approval)
        
        # All rule approvers
        for approver in rule.approvers:
            approval = Approval(
                expense_id=workflow.expense_id,
                approver_id=approver.approver_id,
                workflow_id=workflow.id,
                status=ApprovalStatus.PENDING
            )
            db.add(approval)
    
    async def _create_percentage_approvals(self, workflow: ApprovalWorkflow, rule: ApprovalRule, manager: User, db: Session):
        """Create percentage-based approval records."""
        # Similar to parallel but with percentage logic
        await self._create_parallel_approvals(workflow, rule, manager, db)
    
    async def process_approval(self, approval: Approval, db: Session):
        """Process an approval decision."""
        # Update approval
        approval.status = ApprovalStatus.APPROVED
        approval.approved_at = datetime.utcnow()
        
        # Get workflow
        workflow = db.query(ApprovalWorkflow).filter(
            ApprovalWorkflow.id == approval.workflow_id
        ).first()
        
        # Update workflow progress
        workflow.completed_steps += 1
        
        # Check if workflow is complete
        if await self._is_workflow_complete(workflow, db):
            await self._complete_workflow(workflow, db)
        else:
            # Move to next step if sequential
            await self._move_to_next_step(workflow, db)
    
    async def process_rejection(self, approval: Approval, db: Session):
        """Process a rejection."""
        # Update approval
        approval.status = ApprovalStatus.REJECTED
        approval.approved_at = datetime.utcnow()
        
        # Get workflow and expense
        workflow = db.query(ApprovalWorkflow).filter(
            ApprovalWorkflow.id == approval.workflow_id
        ).first()
        
        expense = db.query(Expense).filter(Expense.id == workflow.expense_id).first()
        
        # Reject the expense
        expense.status = ExpenseStatus.REJECTED
        
        # Cancel remaining approvals
        remaining_approvals = db.query(Approval).filter(
            Approval.workflow_id == workflow.id,
            Approval.status == ApprovalStatus.PENDING
        ).all()
        
        for remaining_approval in remaining_approvals:
            remaining_approval.status = ApprovalStatus.REJECTED
    
    async def _is_workflow_complete(self, workflow: ApprovalWorkflow, db: Session) -> bool:
        """Check if workflow is complete."""
        # Get rule
        rule = db.query(ApprovalRule).filter(ApprovalRule.id == workflow.rule_id).first()
        
        if rule.rule_type == ApprovalRuleType.PERCENTAGE:
            # Check percentage completion
            total_approvals = len(rule.approvers)
            if rule.requires_manager_approval:
                total_approvals += 1
            
            approved_count = db.query(Approval).filter(
                Approval.workflow_id == workflow.id,
                Approval.status == ApprovalStatus.APPROVED
            ).count()
            
            required_approvals = int(total_approvals * rule.minimum_approval_percentage / 100)
            return approved_count >= required_approvals
        else:
            # All approvals must be completed
            pending_approvals = db.query(Approval).filter(
                Approval.workflow_id == workflow.id,
                Approval.status == ApprovalStatus.PENDING
            ).count()
            
            return pending_approvals == 0
    
    async def _complete_workflow(self, workflow: ApprovalWorkflow, db: Session):
        """Complete the approval workflow."""
        # Update expense status
        expense = db.query(Expense).filter(Expense.id == workflow.expense_id).first()
        expense.status = ExpenseStatus.APPROVED
        
        # Update workflow status
        workflow.status = ApprovalStatus.APPROVED
    
    async def _move_to_next_step(self, workflow: ApprovalWorkflow, db: Session):
        """Move to next step in sequential workflow."""
        # This would implement sequential approval logic
        # For now, just update the current step
        workflow.current_step += 1

