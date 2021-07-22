import { SinonStub } from 'sinon';

export type Stub<TMethod extends (...args: any) => any> = SinonStub<Parameters<TMethod>, ReturnType<TMethod>>;
