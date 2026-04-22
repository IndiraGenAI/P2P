import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { ability, type AppAbility } from './index';

export const AbilityContext = createContext<AppAbility>(ability);

export const Can = createContextualCan(AbilityContext.Consumer);
