# Firestore Security Rules (Draft)

Deploy using `firebase deploy --only firestore:rules` after placing rules in `firestore.rules`.

## Basic Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthed() { return request.auth != null; }

    match /families/{familyId} {
      allow read, create: if isAuthed();
      allow update, delete: if isAuthed() && resource.data.ownerId == request.auth.uid;
    }

    match /familyMembers/{docId} {
      allow read: if isAuthed();
      allow create: if isAuthed();
      allow update, delete: if isAuthed() && request.auth.uid == resource.data.userId;
    }

    match /invitations/{inviteId} {
      allow read, create: if isAuthed();
      allow update: if isAuthed() && (request.auth.uid == resource.data.senderId);
      allow delete: if isAuthed() && (request.auth.uid == resource.data.senderId);
    }

    match /groceryItems/{itemId} {
      allow read, create: if isAuthed();
      allow update, delete: if isAuthed();
    }
  }
}
```

## Notes
- This draft is permissive for `groceryItems`; tighten by verifying membership.
- Consider storing memberships as `familyMembers` with composite key `familyId_userId` to quickly check membership.
- Add a function `isMember(familyId)` performing `exists(/databases/{database}/documents/familyMembers/{familyId + '_' + request.auth.uid})` and use in item rules.

## Example Tightened Item Rule
```
match /groceryItems/{itemId} {
  allow read, create: if isAuthed() && isMember(request.resource.data.familyId);
  allow update, delete: if isAuthed() && isMember(resource.data.familyId);
}
```

Revise as you add real membership logic and invitation acceptance flows.
