import { useCallback, useRef, useState } from 'react';
import {
  EditorState,
  convertFromRaw,
  RichUtils,
  DraftEditorCommand,
  DraftHandleValue,
  AtomicBlockUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useRouter } from 'next/router';
import { ContentState, convertToRaw, ContentBlock } from 'draft-js';
import postAPI from 'common/api/postAPI';
import { Post } from 'share/interfaces/post';
import { ATOMIC_BLOCK_TYPE, EDITOR_KEY } from './constants';
import BookCardBlock from 'views/components/editor/book-card-block';

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: '',
      key: EDITOR_KEY,
      type: '',
      entityRanges: [],
      depth: null,
      inlineStyleRanges: [],
    },
  ],
});

export const useEditor = (initialContent?: ContentState) => {
  const router = useRouter();
  const editorContainer = useRef(null);
  const initialState = EditorState.createWithContent(
    initialContent ? initialContent : emptyContentState
  );
  const [editorState, setEditorState] = useState(initialState);

  const handleKeyCommand = useCallback((command: DraftEditorCommand): DraftHandleValue => {
    const newState: EditorState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }, []);

  const submitPost = async () => {
    const contentState: ContentState = editorState.getCurrentContent();
    const hasText: boolean = contentState.hasText();

    if (!hasText) {
      alert('내용을 입력해주새요');
      return;
    }

    const content: string = JSON.stringify(convertToRaw(contentState));
    const post: Post = await postAPI.createPost({ content: content, moodId: 1 });
    router.replace(`post/${post.id}`);
  };

  return {
    editorContainer,
    editorState,
    setEditorState,
    handleKeyCommand,
    submitPost,
  };
};

/* Custom Block 삽입 hook */
export const useEditorCustomBlock = (editorState: EditorState, setEditorState) => {
  const insertCustomBlock = (blockData) => {
    const contentState = editorState.getCurrentContent();
    // ediitor state = content state + selection, history 정보

    const contentStateWithEntity = contentState.createEntity(ATOMIC_BLOCK_TYPE, 'IMMUTABLE', {
      data: blockData,
    }); // entity 생성

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    }); // contentState with book entity 로 변경된 editor state

    const insertedEditorState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    // content state의 book entity를 atomic block 으로 넣어준 editor state

    setEditorState(insertedEditorState);
  };

  const renderCustomBlock = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType();

    if (type !== ATOMIC_BLOCK_TYPE) return;

    return {
      component: BookCardBlock,
      editable: true,
    };
  };

  return {
    insertCustomBlock,
    renderCustomBlock,
  };
};
