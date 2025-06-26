"use client"

import * as React from "react"
import { VList, VListHandle } from "virtua";

type DiffType = 'add' | 'delete' | 'unchanged';

interface DiffLine {
  content: string;
  type: DiffType;
}

function computeDiff(oldLines: string[], newLines: string[], lookAhead: number = 30): [DiffLine[], DiffLine[]] {
  const oldResult: DiffLine[] = [];
  const newResult: DiffLine[] = [];
  let oldIndex = 0;
  let newIndex = 0;

  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    // Look for matching lines within the look-ahead window
    let matchFound = false;
    let matchDistance = 0;

    for (let i = 0; i < lookAhead && oldIndex + i < oldLines.length && newIndex + i < newLines.length; i++) {
      if (oldLines[oldIndex + i] === newLines[newIndex + i]) {
        matchFound = true;
        matchDistance = i;
        break;
      }
    }

    if (matchFound) {
      // Mark lines before match as changes
      for (let i = 0; i < matchDistance; i++) {
        if (oldIndex + i < oldLines.length) {
          oldResult.push({ content: oldLines[oldIndex + i], type: 'delete' });
        }
        if (newIndex + i < newLines.length) {
          newResult.push({ content: newLines[newIndex + i], type: 'add' });
        }
      }
      // Add matching line
      oldResult.push({ content: oldLines[oldIndex + matchDistance], type: 'unchanged' });
      newResult.push({ content: newLines[newIndex + matchDistance], type: 'unchanged' });
      oldIndex += matchDistance + 1;
      newIndex += matchDistance + 1;
    } else {
      // No match found within look-ahead window
      if (oldIndex < oldLines.length) {
        oldResult.push({ content: oldLines[oldIndex], type: 'delete' });
        oldIndex++;
      }
      if (newIndex < newLines.length) {
        newResult.push({ content: newLines[newIndex], type: 'add' });
        newIndex++;
      }
    }
  }

  return [oldResult, newResult];
}

const CodeDisplay = React.forwardRef<VListHandle, {
  codeLines: string[], 
  diffLines?: DiffLine[],
  currentLine: number,
  acceptedChanges: Set<number>
}>(({ 
  codeLines, 
  diffLines, 
  currentLine,
  acceptedChanges
}, ref) => {
  const lines = diffLines || codeLines.map(line => ({ content: line, type: 'unchanged' as DiffType }));
  
  return (
    <VList ref={ref} className="h-svh font-mono">
      {lines.map((line, index) => (
        <div 
          key={index} 
          className={`w-full flex flex-row ${
            line.type === 'add' ? 'bg-green-100 dark:bg-green-900' :
            line.type === 'delete' ? 'bg-red-100 dark:bg-red-900' :
            ''
          } ${
            index === currentLine ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          } ${
            acceptedChanges.has(index) ? 'opacity-50' : ''
          }`}
        >
          <div className="w-8 px-2 text-right text-gray-500">{index + 1}</div>
          <pre className="w-auto overflow-x-hidden whitespace-pre-wrap px-2">{line.content}</pre>
        </div>
      ))}
    </VList>
  );
});
CodeDisplay.displayName = 'CodeDisplay';

interface ControlCenterProps {
  totalDiffs: number;
  currentDiff: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  onAccept: () => void;
  onCopy: () => void;
}

export function DiffEditor({file1Lines: initialFile1Lines, file2Lines}: {file1Lines: string[], file2Lines: string[]}) {
  // Add state for file1Lines
  const [file1Lines, setFile1Lines] = React.useState(initialFile1Lines);
  
  // Recompute diff when file1Lines changes
  const [oldDiff, newDiff] = React.useMemo(() => 
    computeDiff(file1Lines, file2Lines),
    [file1Lines, file2Lines]
  );
  
  const [currentDiffIndex, setCurrentDiffIndex] = React.useState(0);
  const [acceptedChanges, setAcceptedChanges] = React.useState<Set<number>>(new Set());
  
  // Find indices of all additions for navigation
  const additionIndices = React.useMemo(() => 
    newDiff.reduce((acc, line, idx) => 
      line.type === 'add' ? [...acc, idx] : acc, 
    [] as number[]),
    [newDiff]
  );

  const currentLineIndex = additionIndices[currentDiffIndex];
  const totalDiffs = additionIndices.length;

  const handleNavigate = React.useCallback((direction: 'prev' | 'next') => {
    setCurrentDiffIndex(prev => {
      if (direction === 'next' && prev < totalDiffs - 1) return prev + 1;
      if (direction === 'prev' && prev > 0) return prev - 1;
      return prev;
    });
  }, [totalDiffs]);

  const replaceIdenticalLines = React.useCallback((oldContent: string, newContent: string) => {
    setFile1Lines(prev => prev.map(line => 
      line === oldContent ? newContent : line
    ));
  }, []);

  const handleAccept = React.useCallback(() => {
    const currentLine = newDiff[currentLineIndex];
    const oldLine = oldDiff[currentLineIndex];
    
    if (currentLine.type === 'add' && oldLine.type === 'delete') {
      // Replace all identical occurrences
      replaceIdenticalLines(oldLine.content, currentLine.content);
    }

    setAcceptedChanges(prev => {
      const next = new Set(prev);
      next.add(currentLineIndex);
      return next;
    });
  }, [currentLineIndex, newDiff, oldDiff, replaceIdenticalLines]);

  const handleCopy = React.useCallback(() => {
    const text = file1Lines.join('\n');
    navigator.clipboard.writeText(text);
  }, [file1Lines]);

  // Update refs to use VListHandle
  const oldListRef = React.useRef<VListHandle>(null);
  const newListRef = React.useRef<VListHandle>(null);

  React.useEffect(() => {
    // Scroll both lists to the current diff
    oldListRef.current?.scrollToIndex(currentLineIndex, {
      align: "start",
      smooth: true,
      offset: -120 // 5 line heights (24px * 5)
    });
    
    newListRef.current?.scrollToIndex(currentLineIndex, {
      align: "start",
      smooth: true,
      offset: -120 // 5 line heights (24px * 5)
    });
  }, [currentLineIndex]);

  return (
    <div className="fixed inset-0 flex flex-row">
      <div className="flex w-1/2 flex-col h-svh overflow-hidden">
        <CodeDisplay 
          ref={oldListRef}
          codeLines={file1Lines} 
          diffLines={oldDiff}
          currentLine={currentLineIndex}
          acceptedChanges={acceptedChanges}
        />
      </div>

      <div className="flex w-1/2 flex-col h-svh overflow-hidden">
        <CodeDisplay 
          ref={newListRef}
          codeLines={file2Lines} 
          diffLines={newDiff}
          currentLine={currentLineIndex}
          acceptedChanges={acceptedChanges}
        />
      </div>

      <ControlCenter
        totalDiffs={totalDiffs}
        currentDiff={currentDiffIndex + 1}
        onNavigate={handleNavigate}
        onAccept={handleAccept}
        onCopy={handleCopy}
      />
    </div>
  );
}

function ControlCenter({ 
  totalDiffs, 
  currentDiff, 
  onNavigate, 
  onAccept, 
  onCopy
}: ControlCenterProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg px-6 py-3 flex items-center gap-4 border border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {currentDiff} / {totalDiffs} changes
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('prev')}
          disabled={currentDiff === 1}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          aria-label="Previous change"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => onNavigate('next')}
          disabled={currentDiff === totalDiffs}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          aria-label="Next change"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={onAccept}
          className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          aria-label="Accept change"
        >
          Accept
        </button>

        <button
          onClick={onCopy}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Copy current content"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

