import { For, Show, createSignal, onCleanup } from "solid-js";
import { ChevronDown } from "lucide-solid";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  options: SelectOption[];
  value: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  onChange: (value: string) => void;
};

export default function Select(props: SelectProps) {
  const [open, setOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const selectedLabel = () => {
    const opt = props.options.find((o) => o.value === props.value);
    return opt?.label ?? props.placeholder ?? "Select...";
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef && !containerRef.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  const handleSelect = (value: string) => {
    props.onChange(value);
    setOpen(false);
  };

  // Close on outside click
  if (typeof document !== "undefined") {
    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  }

  return (
    <div
      ref={containerRef}
      class={`relative ${props.class ?? ""}`}
    >
      <button
        type="button"
        disabled={props.disabled}
        onClick={() => !props.disabled && setOpen(!open())}
        class={`w-full flex items-center justify-between gap-2 rounded-xl bg-gray-2/60 px-3 py-2 text-sm shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-gray-6/20 transition-colors ${
          props.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-3/50"
        } ${props.value ? "text-gray-12" : "text-gray-10"}`}
      >
        <span class="truncate">{selectedLabel()}</span>
        <ChevronDown
          size={14}
          class={`shrink-0 text-gray-10 transition-transform ${open() ? "rotate-180" : ""}`}
        />
      </button>

      <Show when={open()}>
        <div class="absolute z-50 mt-1 w-full rounded-xl border border-gray-6 bg-gray-2 shadow-xl overflow-hidden">
          <div class="max-h-48 overflow-y-auto py-1">
            <For each={props.options}>
              {(option) => (
                <button
                  type="button"
                  class={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    option.value === props.value
                      ? "bg-gray-4 text-gray-12"
                      : "text-gray-11 hover:bg-gray-3 hover:text-gray-12"
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
