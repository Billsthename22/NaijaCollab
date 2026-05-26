INSERT INTO rate_limit_policies (
    id, policy_key, scope, limit_count, window_seconds, burst_count, enabled, created_at, updated_at
) VALUES
    ('5f75eb4d-5d60-43a4-b343-30fd3736642a', 'auth_login_ip', 'IP', 10, 60, 0, TRUE, now(), now()),
    ('3199f9fd-a3d2-498d-b82f-4d8807c8dca9', 'auth_login_user', 'USER', 5, 60, 0, TRUE, now(), now()),
    ('ff145305-bd0d-4c4d-b2f7-c8170a165524', 'auth_register_ip', 'IP', 5, 600, 0, TRUE, now(), now()),
    ('4d8ccb24-0068-40bc-b4a7-3e6d77361111', 'moderation_report_ip', 'IP', 20, 3600, 0, TRUE, now(), now()),
    ('8fe2e24d-6c3e-4175-8a95-ed550a66ac95', 'moderation_report_user', 'USER', 20, 3600, 0, TRUE, now(), now())
ON CONFLICT (policy_key) DO NOTHING;

