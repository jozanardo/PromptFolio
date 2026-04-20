import type {
  CommandContext,
  CommandExecutionResult,
  ErrorBlock,
  ParsedCommandInput,
} from '../../types';
import { parseCommandInput } from './parseCommandInput';

export interface CommandDispatchResult {
  parsedInput: ParsedCommandInput;
  result: CommandExecutionResult;
}

function createErrorResult(
  command: string | undefined,
  message: string
): CommandExecutionResult {
  const block: ErrorBlock = {
    type: 'error',
    command,
    message,
  };

  return {
    blocks: [block],
    echoInput: true,
  };
}

export async function executeCommand(
  rawInput: string,
  context: CommandContext
): Promise<CommandDispatchResult> {
  const initialParsedInput = parseCommandInput(rawInput);
  const command = context.registry.get(initialParsedInput.commandName);
  const parsedInput = command?.meta.parsing
    ? parseCommandInput(rawInput, command.meta.parsing)
    : initialParsedInput;

  if (!parsedInput.commandName) {
    return {
      parsedInput,
      result: {
        blocks: [],
        echoInput: false,
      },
    };
  }

  if (parsedInput.tokenizationError) {
    return {
      parsedInput,
      result: createErrorResult(
        parsedInput.commandName,
        parsedInput.tokenizationError
      ),
    };
  }

  if (!command) {
    return {
      parsedInput,
      result: createErrorResult(
        parsedInput.commandName,
        context.shellMessages.notFoundMessage
      ),
    };
  }

  const parsedArgs = command.parse(parsedInput, context);

  if (!parsedArgs.ok) {
    return {
      parsedInput,
      result: createErrorResult(parsedInput.commandName, parsedArgs.message),
    };
  }

  const result = await command.execute(parsedArgs.args, context, parsedInput);

  return {
    parsedInput,
    result: {
      echoInput: true,
      effects: [],
      ...result,
    },
  };
}
