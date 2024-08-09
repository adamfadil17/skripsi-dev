'use client';
import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Alert from 'editorjs-alert';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import SimpleImage from '@editorjs/simple-image';
import CodeTool from '@editorjs/code';
import Paragraph from '@editorjs/paragraph';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/database/firebaseConfig';
import { useUser } from '@clerk/nextjs';

const RichDocumentEditor = ({ params }) => {
  const ref = useRef();
  let editor;
  let isFetched = false;

  const { user } = useUser();
  const emailUser = user?.primaryEmailAddress?.emailAddress;
  console.log(emailUser);

  useEffect(() => {
    user && initEditor();
  }, [user]);

  const saveDocument = () => {
    ref.current.save().then(async (outputData) => {
      const docRef = doc(db, 'documentOutput', params?.documentid);
      await updateDoc(docRef, {
        output: outputData,
        editedBy: emailUser,
      });
    });
  };

  const getDocumentOutput = () => {
    const fetchOutput = onSnapshot(
      doc(db, 'documentOutput', params?.documentid),
      (doc) => {
        if (isFetched == false || doc.data()?.editedBy !== emailUser) {
          doc.data()?.output && editor?.render(doc.data()?.output);
        }
        isFetched = true;
      }
    );
  };

  const initEditor = () => {
    if (!editor?.current) {
      editor = new EditorJS({
        onChange: (api, event) => {
          saveDocument();
        },
        onReady: () => {
          getDocumentOutput();
        },
        /**
         * Id of Element that should contain Editor instance
         */
        holder: 'editorjs',
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+A',
            config: {
              alertTypes: [
                'primary',
                'secondary',
                'info',
                'success',
                'warning',
                'danger',
                'light',
                'dark',
              ],
              defaultType: 'primary',
              messagePlaceholder: 'Enter something',
            },
          },
          table: Table,
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L',
            config: {
              defaultStyle: 'unordered',
            },
          },
          checklist: {
            class: Checklist,
            shortcut: 'CMD+SHIFT+C',
            inlineToolbar: true,
          },
          image: SimpleImage,
          code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+P',
          },
        },
      });
      ref.current = editor;
    }
  };
  return (
    <div className="lg:mr-40">
      <div id="editorjs"></div>
    </div>
  );
};

export default RichDocumentEditor;
