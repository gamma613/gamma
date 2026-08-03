'use client';

import { Button, IconButton } from '@/components';
import { cn } from '@/lib/utils';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  faAngleDown,
  faAngleUp,
  faCircleXmark,
  faForwardStep,
  faGripVertical,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { Popover } from 'radix-ui';
import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { PlaylistActionItem } from './PlaylistActionItem';
import { PlaylistSection } from './PlaylistSection';

// ----------------------------------------------------------------------

type SortableHandleContextValue = Pick<
  ReturnType<typeof useSortable>,
  'attributes' | 'isDragging' | 'listeners'
>;

const SortableHandleContext = createContext<SortableHandleContextValue | null>(null);

export function UserQueue({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { queue, clearQueue, removeFromQueue, playId, queueNext, reorderQueue } = usePlayerMain();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const fromIndex = queue.indexOf(String(active.id));
    const toIndex = queue.indexOf(String(over.id));
    reorderQueue(fromIndex, toIndex);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={queue} strategy={verticalListSortingStrategy}>
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
          renderItemContainer={(children, trackId, { absoluteIndex }) => (
            <SortableQueueItem key={`${trackId}-${absoluteIndex}`} trackId={trackId}>
              {children}
            </SortableQueueItem>
          )}
          renderBeforeActions={(_, { absoluteIndex }) => (
            <QueueMoveButton
              index={absoluteIndex}
              queueLength={queue.length}
              onMove={reorderQueue}
            />
          )}
          renderActions={(trackId, { absoluteIndex, isCurrent }) => (
            <>
              {!isCurrent && (
                <PlaylistActionItem
                  icon={faPlay}
                  label="Play now"
                  onClick={() => playId(trackId)}
                />
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
      </SortableContext>
    </DndContext>
  );
}

function SortableQueueItem({ children, trackId }: { children: ReactNode; trackId: string }) {
  const sortable = useSortable({ id: trackId });
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = sortable;
  const style: CSSProperties = {
    opacity: isDragging ? 0.6 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <SortableHandleContext.Provider value={{ attributes, isDragging, listeners }}>
      <li ref={setNodeRef} className={cn(isDragging && 'relative')} style={style}>
        {children}
      </li>
    </SortableHandleContext.Provider>
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
  const sortableHandle = useContext(SortableHandleContext);
  const canMoveUp = index > 0;
  const canMoveDown = index < queueLength - 1;

  if ((!canMoveUp && !canMoveDown) || !sortableHandle) return null;

  const moveTo = (toIndex: number) => {
    onMove(index, toIndex);
    setOpen(false);
  };
  const { attributes, listeners } = sortableHandle;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <IconButton
          icon={faGripVertical}
          label="Move"
          type="button"
          variant="ghost"
          aria-haspopup="menu"
          aria-expanded={open}
          className="touch-none cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
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
                icon={faAngleUp}
                label="Move up"
                onClick={() => moveTo(index - 1)}
              />
            )}
            {canMoveDown && (
              <PlaylistActionItem
                icon={faAngleDown}
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
