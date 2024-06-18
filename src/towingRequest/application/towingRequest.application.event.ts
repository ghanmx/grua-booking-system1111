export namespace TowingRequestApplicationEvent {
  export class TowingRequestCreated {
    static readonly key = 'towingRequest.created';
    constructor(public readonly id: string, public readonly userId: string) {}
  }
}