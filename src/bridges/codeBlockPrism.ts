import { CodeBlockPrism } from '../extentions/CodeBlockPrism';

import BridgeExtension from './base';

type CodeBlockEditorState = {
  isCodeBlockActive: boolean;
  canToggleCodeBlock: boolean;
};

type CodeBlockEditorInstance = {
  toggleCodeBlock: () => void;
};

declare module '../types/EditorBridge' {
  interface BridgeState extends CodeBlockEditorState {}
  interface EditorBridge extends CodeBlockEditorInstance {}
}

export enum CodeBlockEditorActionType {
  ToggleCodeBlock = 'toggle-code-block',
}

type CodeBlockMessage = {
  type: CodeBlockEditorActionType.ToggleCodeBlock;
  payload?: undefined;
};

export const CodeBlockPrismBridge = new BridgeExtension<
  CodeBlockEditorState,
  CodeBlockEditorInstance,
  CodeBlockMessage
>({
  tiptapExtension: CodeBlockPrism,

  onBridgeMessage: (editor, message) => {
    if (message.type === CodeBlockEditorActionType.ToggleCodeBlock) {
      editor.chain().focus().toggleCodeBlock().run();
    }

    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      toggleCodeBlock: () =>
        sendBridgeMessage({ type: CodeBlockEditorActionType.ToggleCodeBlock }),
    };
  },
  extendEditorState: (editor) => {
    return {
      canToggleCodeBlock: editor.can().toggleCodeBlock(),
      isCodeBlockActive: editor.isActive('codeBlock'),
    };
  },
});
