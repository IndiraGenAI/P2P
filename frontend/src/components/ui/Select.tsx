import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SelectOption } from '@/common/models';

export type { SelectOption } from '@/common/models';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

interface PanelPos {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: 'bottom' | 'top';
}

const ESTIMATED_PANEL_HEIGHT = 256;
const PANEL_GAP = 8;
const VIEWPORT_PADDING = 12;

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select',
  size = 'md',
  className = '',
  fullWidth = true,
  disabled = false,
}: Readonly<SelectProps>) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [pos, setPos] = useState<PanelPos | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = options.find((o) => o.value === value);

  const updatePosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
    const spaceAbove = rect.top - VIEWPORT_PADDING;
    const placement: 'bottom' | 'top' =
      spaceBelow >= ESTIMATED_PANEL_HEIGHT || spaceBelow >= spaceAbove ? 'bottom' : 'top';
    const maxHeight = Math.min(
      ESTIMATED_PANEL_HEIGHT,
      placement === 'bottom' ? spaceBelow : spaceAbove,
    );
    setPos({
      top: placement === 'bottom' ? rect.bottom + PANEL_GAP : rect.top - PANEL_GAP,
      left: rect.left,
      width: rect.width,
      maxHeight,
      placement,
    });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleReposition = () => updatePosition();

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value);
      setHighlight(Math.max(idx, 0));
    }
  }, [open, options, value]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = options[highlight];
      if (opt) {
        onChange(opt.value);
        setOpen(false);
      }
    }
  };

  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-3.5 py-2.5 text-sm';

  const panel = open && pos && (
    <div
      ref={panelRef}
      id={listboxId}
      className="fixed z-[100] animate-fadeIn"
      style={{
        top: pos.placement === 'bottom' ? pos.top : undefined,
        bottom: pos.placement === 'top' ? window.innerHeight - pos.top : undefined,
        left: pos.left,
        width: pos.width,
      }}
    >
      <div
        className="bg-white rounded-xl py-1.5 overflow-y-auto soft-scroll"
        style={{
          maxHeight: pos.maxHeight,
          boxShadow:
            '0 4px 6px -2px rgba(16, 24, 40, 0.05), 0 12px 28px -4px rgba(16, 24, 40, 0.12)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        {options.length === 0 && (
          <p className="px-4 py-3 text-sm text-gray-400 text-center">No options</p>
        )}
        {options.map((opt, idx) => {
          const isSelected = opt.value === value;
          const isHighlighted = idx === highlight;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlight(idx)}
              className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-sm text-left transition rounded-lg ${
                isSelected ? 'text-emerald-700 font-medium' : 'text-gray-700'
              } ${isHighlighted ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
              style={{ width: 'calc(100% - 0.5rem)', margin: '0 0.25rem' }}
            >
              <span className="truncate">{opt.label}</span>
              {isSelected && (
                <Check size={16} className="text-emerald-600 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleKey}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listboxId}
        className={`w-full flex items-center justify-between gap-2 rounded-xl soft-input transition ${sizeClasses} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${open ? 'ring-2 ring-emerald-500/20 border-emerald-300' : ''}`}
      >
        <span
          className={`truncate text-left ${selected ? 'text-gray-900' : 'text-gray-400'}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {panel && createPortal(panel, document.body)}
    </div>
  );
}
