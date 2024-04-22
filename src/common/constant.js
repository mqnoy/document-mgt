export const filterKeys = {
  Title: 'title',
  ObjectName: 'objectName',
  MemberId: 'memberId',
};

export const Role = {
  Member: 'member',
};

export const Scopes = {
  Me: 'ME',
  CreateDocument: 'CD',
  EditDocument: 'ED',
  RemoveDocument: 'RD',
  ShareDocument: 'SD',
  ListDocument: 'LD',
  UploadDocument: 'UD',
  DownloadDocument: 'DD',
};

export const MemberScoppes = [
  Scopes.Me,
  Scopes.CreateDocument,
  Scopes.EditDocument,
  Scopes.RemoveDocument,
  Scopes.ShareDocument,
  Scopes.ListDocument,
  Scopes.UploadDocument,
  Scopes.DownloadDocument,
];

export const MapScopes = {
  [Role.Member]: MemberScoppes,
};
