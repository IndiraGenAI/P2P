import { useContext, useMemo, useState } from 'react';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { message, Tooltip } from 'antd';
import { AbilityContext } from '@/ability/can';
import { Common } from '@/utils/constants/constant';

interface MaskedValueProps {
  /** The actual sensitive value to mask. */
  value?: string | number | null;
  /**
   * Page code (subject) used for the CASL permission check.
   * Pass the same `Modules.MASTER.X` you use elsewhere.
   * If omitted, no eye toggle is shown for anyone.
   */
  pageCode?: string;
  /**
   * Action required to reveal the value. Defaults to `UPDATE` (CAN_UPDATE)
   * — i.e. only users with edit access on the page can unmask.
   */
  action?: string;
  /** Character used in the mask. Defaults to `•`. */
  maskChar?: string;
  /**
   * Length of the mask shown to users WITHOUT reveal permission.
   * Defaults to 6 (so it always looks like `••••••` and never leaks length).
   */
  maskLength?: number;
  /** Allow copying the revealed value to the clipboard. Defaults to true. */
  allowCopy?: boolean;
  /**
   * When the revealed value is longer than this, the on-screen text is
   * truncated with `…` and the full value is shown in an antd tooltip on
   * hover (same UX as the shared `showTooltip` helper). Omit to disable.
   */
  maxLength?: number;
  /** Extra class names for the wrapper. */
  className?: string;
}

/**
 * Renders a sensitive value as a fixed-length mask (e.g. `••••••`).
 * If the current user has the required permission, a small eye-toggle button
 * appears next to the value letting them reveal/hide it (and copy it).
 *
 * Usage:
 *   <MaskedValue value={row.tax_id} pageCode={Modules.MASTER.VENDOR} />
 *   <MaskedValue value="secret" pageCode="MASTER_GST" action="VIEW" />
 */
export const MaskedValue = ({
  value,
  pageCode,
  action = Common.Actions.CAN_UPDATE,
  maskChar = '•',
  maskLength = 6,
  allowCopy = true,
  maxLength,
  className = '',
}: MaskedValueProps) => {
  const ability = useContext(AbilityContext);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const stringValue = useMemo(() => {
    if (value === null || value === undefined || value === '') return '';
    return String(value);
  }, [value]);

  const canReveal = useMemo(
    () => (pageCode ? ability.can(action, pageCode) : false),
    [ability, action, pageCode],
  );

  const masked = maskChar.repeat(maskLength);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(stringValue);
      setCopied(true);
      message.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      message.error('Failed to copy');
    }
  };

  if (!stringValue) {
    return <span className={`text-gray-400 ${className}`}>—</span>;
  }

  if (!canReveal) {
    return (
      <span
        className={`inline-flex items-center text-gray-500 tracking-widest select-none ${className}`}
        title="Hidden — you don't have permission to view this value"
      >
        {masked}
      </span>
    );
  }

  const shouldTruncate =
    revealed &&
    typeof maxLength === 'number' &&
    maxLength > 0 &&
    stringValue.length > maxLength;

  const valueNode = (() => {
    if (!revealed) {
      return (
        <span className="text-gray-500 tracking-widest select-none">
          {masked}
        </span>
      );
    }
    if (shouldTruncate) {
      return (
        <Tooltip
          title={stringValue}
          placement="top"
          mouseEnterDelay={0.15}
          color="#ffffff"
          rootClassName="soft-tooltip"
          styles={{
            body: {
              color: '#374151',
              fontSize: 12,
              fontWeight: 500,
              padding: '8px 12px',
              borderRadius: 12,
              border: '1px solid rgba(15, 23, 42, 0.06)',
              boxShadow:
                '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 4px 10px -2px rgba(15, 23, 42, 0.08)',
              maxWidth: 360,
              wordBreak: 'break-word',
            },
          }}
        >
          <span className="text-gray-800 font-medium cursor-help underline decoration-dotted decoration-gray-300 underline-offset-4">
            {stringValue.slice(0, maxLength)}…
          </span>
        </Tooltip>
      );
    }
    return <span className="text-gray-800 font-medium">{stringValue}</span>;
  })();

  return (
    <span className={`inline-flex items-center gap-1.5 align-middle ${className}`}>
      {valueNode}

      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? 'Hide value' : 'Reveal value'}
        title={revealed ? 'Hide value' : 'Reveal value'}
        className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
      >
        {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>

      {allowCopy && revealed && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy value"
          title="Copy to clipboard"
          className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
        >
          {copied ? (
            <Check size={13} className="text-emerald-600" />
          ) : (
            <Copy size={13} />
          )}
        </button>
      )}
    </span>
  );
};

export default MaskedValue;
