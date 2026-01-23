import { createSignal, For, Show, onCleanup, createEffect } from "solid-js";
import { ChevronDown, Check } from "lucide-solid";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  options: SelectOption[];
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  class?: string;
};

// Custom Select component with improved UI and accessibility
export default function Select(props: SelectProps) {
  const [open, setOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  // Find the selected option label
  const selectedLabel = () => {
    const option = props.options.find((opt) => opt.value === props.value);
    return option?.label ?? "";
  };

  // Handle click outside to close dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.disabled) return;

    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      if (!open()) {
        e.preventDefault();
        setOpen(true);
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open()) {
        setOpen(true);
      }
    }
  };

  // Add/remove click outside listener when dropdown opens/closes
  createEffect(() => {
    if (open()) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  });

  onCleanup(() => {
    document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleSelect = (value: string) => {
    props.onChange(value);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      class={`relative ${props.class ?? ""}`.trim()}
    >
      {/* Trigger button */}
      <button
        type="button"
        disabled={props.disabled}
        onClick={() => !props.disabled && setOpen(!open())}
        onKeyDown={handleKeyDown}
        class={`
          w-full h-8 px-3 flex items-center justify-between gap-2
          rounded-lg border text-xs text-left
          transition-colors duration-150
          ${props.disabled
            ? "bg-gray-2/50 border-gray-5 text-gray-9 cursor-not-allowed opacity-60"
            : "bg-gray-2 border-gray-6 text-gray-12 hover:border-gray-7 cursor-pointer"
          }
          ${open() ? "border-gray-7 ring-2 ring-gray-6/20" : ""}
        `.trim()}
        aria-haspopup="listbox"
        aria-expanded={open()}
      >
        <span class={props.value ? "text-gray-12" : "text-gray-10"}>
          {props.value ? selectedLabel() : props.placeholder}
        </span>
        <ChevronDown
          size={14}
          class={`shrink-0 text-gray-10 transition-transform duration-150 ${open() ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      <Show when={open()}>
        <div
          class="
            absolute z-50 mt-1 w-full
            bg-gray-2 border border-gray-6 rounded-lg shadow-xl
            max-h-48 overflow-y-auto
            animate-in fade-in slide-in-from-top-1 duration-150
          "
          role="listbox"
        >
          <For each={props.options}>
            {(option) => (
              <button
                type="button"
                role="option"
                aria-selected={props.value === option.value}
                onClick={() => handleSelect(option.value)}
                class={`
                  w-full px-3 py-2 text-xs text-left flex items-center justify-between gap-2
                  transition-colors duration-100
                  ${props.value === option.value
                    ? "bg-gray-3 text-gray-12"
                    : "text-gray-11 hover:bg-gray-3/50 hover:text-gray-12"
                  }
                  first:rounded-t-lg last:rounded-b-lg
                `}
              >
                <span class="truncate">{option.label}</span>
                <Show when={props.value === option.value}>
                  <Check size={12} class="shrink-0 text-gray-11" />
                </Show>
              </button>
            )}
          </For>
          <Show when={props.options.length === 0}>
            <div class="px-3 py-2 text-xs text-gray-10">No options available</div>
          </Show>
        </div>
      </Show>
    </div>
  );
}
