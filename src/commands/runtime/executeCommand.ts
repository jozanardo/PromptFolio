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

function resolveErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Command execution failed.';
}

function createErrorResult(
  command: string | undefined,
  message: string
): CommandExecutionResult {
  const block: ErrorBlock = command
    ? {
        type: 'error',
        command,
        message,
      }
    : {
        type: 'error',
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

  if (parsedInput.tokenizationError) {
    return {
      parsedInput,
      result: createErrorResult(
        parsedInput.commandName || undefined,
        parsedInput.tokenizationError
      ),
    };
  }

  if (!parsedInput.commandName) {
    return {
      parsedInput,
      result: {
        blocks: [],
        echoInput: false,
      },
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

  let parsedArgs;

  try {
    parsedArgs = command.parse(parsedInput, context);
  } catch (error) {
    return {
      parsedInput,
      result: createErrorResult(
        parsedInput.commandName || command.meta.name,
        resolveErrorMessage(error)
      ),
    };
  }

  if (!parsedArgs.ok) {
    return {
      parsedInput,
      result: createErrorResult(parsedInput.commandName, parsedArgs.message),
    };
  }

  let result;

  try {
    result = await command.execute(parsedArgs.args, context, parsedInput);
  } catch (error) {
    return {
      parsedInput,
      result: createErrorResult(
        parsedInput.commandName || command.meta.name,
        resolveErrorMessage(error)
      ),
    };
  }

  return {
    parsedInput,
    result: {
      echoInput: true,
      effects: [],
      ...result,
    },
  };
}
