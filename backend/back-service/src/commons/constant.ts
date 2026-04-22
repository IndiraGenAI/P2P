export interface BatchExamPortal {
    name: string,
    classEquivalent: string,
    subjects: string[],
    description: string,
    stream: string[],
    competitiveEquivalent: string[],
    linkSharingEnabled: boolean,
    argumentsllowSubjectSelectionInBatchLinkSharing: boolean,
    allowExistingToJoin: boolean,
    autoLoginOnSignup: boolean,
    allowCollectingExtraInfo: boolean,
    autoActivateOnSignup: boolean,
    notifyOnSignup: boolean
  }