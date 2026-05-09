# Role Permissions

## Defined Roles
- `owner`: All privileges.
- `producer`: Finalize scripts, publish, manage team, review completion.
- `scriptwriter`: Edit scripts.
- `researcher`: Approve fact checks before producer approval.
- `visual_designer`: Visual generation only.
- `editor`: Voice and Rough Cut approval.
- `ops_manager`: Upload scheduling, templates, automation runs.
- `reviewer`: General approval assigned states.

## Constraints
- **Server-Side Enforcement**: All stage transitions and approval changes are strictly validated and enforced in Firestore Security Rules. Role checks verify membership via the `members` collection.
- API and direct client writes cannot bypass mandatory approvals. State locking on projects occurs during execution.
- Webhook callbacks and Automations are role-agnostic but they can **never** trigger finalize states (like script approval or final publish to web). They can only place things in pending review queue.
- Only users with `canFinalizePublish` via the matrix can do the manual publish stage.
