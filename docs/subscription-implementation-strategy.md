Implementation Strategy:

Phase 1: Core Usage Tracking (Priority 1)

1. Database Schema - Add user_usage table to track monthly response generations
2. Usage Service - Track each generation in GenerateRizzJobHandler:31-36
3. Enforcement - Block free users at 5/month in ConversationGenerationService:21

Phase 2: User Experience (Priority 2)

4. Subscription Modal - Trigger when limit reached
5. Pricing Card - Gumroad purchase button component
6. Usage Display - Show "X/5 responses used" for free users

Phase 3: Integration (Priority 3)

7. API Integration - Add usage checks to conversation endpoints
8. End-to-end Testing - Complete user flow validation

Key Technical Decisions:

Usage Tracking Table Structure:
user_usage: userId, month_year, response_count, created_at, updated_at

Monthly Reset Logic: Use YYYY-MM format for easy querying and automatic reset

Enforcement Point: Before job creation in ConversationGenerationService (prevents wasted processing)

UI Integration: Leverage existing subscription status from layout data

This approach minimizes changes to your existing flow while adding robust usage tracking
