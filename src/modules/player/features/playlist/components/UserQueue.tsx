'use client';

import { Button, IconButton } from '@/components';
import {
  faArrowDown,
  faArrowUp,
  faCircleXmark,
  faForwardStep,
  faGripVertical,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { Popover } from 'radix-ui';
import { useState, type DragEvent } from 'react';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { PlaylistActionItem } from './PlaylistActionItem';
import { PlaylistSection } from './PlaylistSection';

// ----------------------------------------------------------------------

const QUEUE_DRAG_INDEX_TYPE = 'application/x-gamma-queue-index';

export function UserQueue({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { queue, clearQueue, removeFromQueue, playId, queueNext, reorderQueue } = usePlayerMain();

  return (
    <PlaylistSection
      title="Manually added"
      itemKey="user-queue"
      itemsPerPage={itemsPerPage}
      items={queue.map((trackId) => ({ trackId }))}
      actionsInPopover
      empty={
        <p className="rf-sm text-muted-foreground">
          {`Curate your listening experience using the "Play Next" and "Enqueue" buttons.`}
        </p>
      }
      headerRight={
        queue.length > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearQueue}>
            Clear
          </Button>
        ) : null
      }
      renderBeforeActions={(_, { absoluteIndex }) => (
        <QueueMoveButton index={absoluteIndex} queueLength={queue.length} onMove={reorderQueue} />
      )}
      renderActions={(trackId, { absoluteIndex, isCurrent }) => (
        <>
          {!isCurrent && (
            <PlaylistActionItem icon={faPlay} label="Play now" onClick={() => playId(trackId)} />
          )}

          {absoluteIndex !== 0 && !isCurrent && (
            <PlaylistActionItem
              icon={faForwardStep}
              label="Play next"
              onClick={() => queueNext(trackId)}
            />
          )}

          <PlaylistActionItem
            icon={faCircleXmark}
            label="Remove"
            onClick={() => removeFromQueue(trackId)}
          />
        </>
      )}
    />
  );
}

function QueueMoveButton({
  index,
  onMove,
  queueLength,
}: {
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  queueLength: number;
}) {
  const [open, setOpen] = useState(false);
  const canMoveUp = index > 0;
  const canMoveDown = index < queueLength - 1;

  if (!canMoveUp && !canMoveDown) return null;

  const moveTo = (toIndex: number) => {
    onMove(index, toIndex);
    setOpen(false);
  };

  const onDragStart = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(QUEUE_DRAG_INDEX_TYPE, String(index));
    event.dataTransfer.setData('text/plain', String(index));
  };

  const onDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const rawIndex =
      event.dataTransfer.getData(QUEUE_DRAG_INDEX_TYPE) || event.dataTransfer.getData('text/plain');
    const fromIndex = Number.parseInt(rawIndex, 10);
    if (!Number.isFinite(fromIndex)) return;
    onMove(fromIndex, index);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <IconButton
          icon={faGripVertical}
          label="Move"
          type="button"
          variant="ghost"
          draggable
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          aria-haspopup="menu"
          aria-expanded={open}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="left"
          align="start"
          sideOffset={8}
          aria-label="Move queue item"
          className="z-50 rounded-lg border bg-background/80 p-1 text-popover-foreground shadow-md supports-[backdrop-filter]:backdrop-blur-md"
          onClickCapture={(event) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;
            if (!target.closest('button,a,[role=menuitem]')) return;
            window.setTimeout(() => setOpen(false), 0);
          }}
        >
          <div className="flex flex-col">
            {canMoveUp && (
              <PlaylistActionItem
                icon={faArrowUp}
                label="Move up"
                onClick={() => moveTo(index - 1)}
              />
            )}
            {canMoveDown && (
              <PlaylistActionItem
                icon={faArrowDown}
                label="Move down"
                onClick={() => moveTo(index + 1)}
              />
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
