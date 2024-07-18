export function flagUserNoncesSequenced(callConfig: number): boolean {
  return (Number(callConfig) & 0) !== 0;
}

export function flagDAppNoncesSequenced(callConfig: number): boolean {
  return (Number(callConfig) & 2) !== 0;
}

export function flagRequirePreOps(callConfig: number): boolean {
  return (Number(callConfig) & 4) !== 0;
}

export function flagTrackPreOpsReturnData(callConfig: number): boolean {
  return (Number(callConfig) & 8) !== 0;
}

export function flagTrackUserReturnData(callConfig: number): boolean {
  return (Number(callConfig) & 16) !== 0;
}

export function flagDelegateUser(callConfig: number): boolean {
  return (Number(callConfig) & 32) !== 0;
}

export function flagPreSolver(callConfig: number): boolean {
  return (Number(callConfig) & 64) !== 0;
}

export function flagPostSolver(callConfig: number): boolean {
  return (Number(callConfig) & 128) !== 0;
}

export function flagPostOpsCall(callConfig: number): boolean {
  return (Number(callConfig) & 256) !== 0;
}

export function flagZeroSolvers(callConfig: number): boolean {
  return (Number(callConfig) & 512) !== 0;
}

export function flagReuseUserOp(callConfig: number): boolean {
  return (Number(callConfig) & 1024) !== 0;
}

export function flagUserAuctioneer(callConfig: number): boolean {
  return (Number(callConfig) & 2048) !== 0;
}

export function flagSolverAuctioneer(callConfig: number): boolean {
  return (Number(callConfig) & 4096) !== 0;
}

export function flagUnknownAuctioneer(callConfig: number): boolean {
  return (Number(callConfig) & 8192) !== 0;
}

export function flagVerifyCallChainHash(callConfig: number): boolean {
  return (Number(callConfig) & 16384) !== 0;
}

export function flagForwardReturnData(callConfig: number): boolean {
  return (Number(callConfig) & 32768) !== 0;
}

export function flagflagFulfillment(callConfig: number): boolean {
  return (Number(callConfig) & 65536) !== 0;
}

export function flagTrustedOpHash(callConfig: number): boolean {
  return (Number(callConfig) & 131072) !== 0;
}

export function flagInvertBidValue(callConfig: number): boolean {
  return (Number(callConfig) & 262144) !== 0;
}

export function flagExPostBids(callConfig: number): boolean {
  return (Number(callConfig) & 524288) !== 0;
}
