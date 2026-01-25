import { createMemo, Show } from "solid-js";

import { AlertTriangle, X } from "lucide-solid";
import { t, currentLocale } from "../../i18n";

import Button from "./button";
import { sanitizeCommandName, willSanitizeName } from "../command-state";

export type CommandModalProps = {
  open: boolean;
  name: string;
  description: string;
  template: string;
  scope: "workspace" | "global";
  showOverrideConfirmation: boolean;
  onClose: () => void;
  onSave: () => void;
  onCancelOverride: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTemplateChange: (value: string) => void;
  onScopeChange: (value: "workspace" | "global") => void;
};

export default function CommandModal(props: CommandModalProps) {
  const translate = (key: string) => t(key, currentLocale());

  const sanitizedName = createMemo(() => sanitizeCommandName(props.name));
  const showSanitizedHint = createMemo(() => willSanitizeName(props.name));

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 bg-gray-1/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-gray-2 border border-gray-6/70 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-12">
                  {props.showOverrideConfirmation
                    ? translate("commands.override_title")
                    : translate("commands.modal_title")}
                </h3>
                <p class="text-sm text-gray-11 mt-1">
                  {props.showOverrideConfirmation
                    ? translate("commands.override_description")
                    : translate("commands.modal_description")}
                </p>
              </div>
              <Button variant="ghost" class="!p-2 rounded-full" onClick={props.onClose}>
                <X size={16} />
              </Button>
            </div>

            <Show when={props.showOverrideConfirmation}>
              <div class="mt-6 rounded-xl bg-amber-3/30 border border-amber-6 p-4 flex items-start gap-3">
                <AlertTriangle size={20} class="text-amber-11 shrink-0 mt-0.5" />
                <div class="text-sm text-amber-12">
                  {translate("commands.override_warning").replace("{name}", sanitizedName())}
                </div>
              </div>
            </Show>

            <div class="mt-6 space-y-4" classList={{ "opacity-50 pointer-events-none": props.showOverrideConfirmation }}>
              <label class="block">
                <div class="mb-1 flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-11">{translate("commands.name_label")}</span>
                  <span
                    class="text-xs text-amber-11 flex items-center gap-1 h-4"
                    classList={{ invisible: !showSanitizedHint() }}
                  >
                    <AlertTriangle size={12} />
                    {translate("commands.name_will_be")} <code class="bg-gray-4 px-1 rounded">{sanitizedName()}</code>
                  </span>
                </div>
                <input
                  class="w-full rounded-xl bg-gray-2/60 px-3 py-2 text-sm text-gray-12 placeholder:text-gray-10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-gray-6/20"
                  value={props.name}
                  onInput={(event) => props.onNameChange(event.currentTarget.value)}
                  placeholder={translate("commands.name_placeholder")}
                />
                <div class="mt-1 text-xs text-gray-10">{translate("commands.name_hint")}</div>
              </label>

              <label class="block">
                <div class="mb-1 text-xs font-medium text-gray-11">{translate("commands.description_label")}</div>
                <input
                  class="w-full rounded-xl bg-gray-2/60 px-3 py-2 text-sm text-gray-12 placeholder:text-gray-10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-gray-6/20"
                  value={props.description}
                  onInput={(event) => props.onDescriptionChange(event.currentTarget.value)}
                  placeholder={translate("commands.description_placeholder")}
                />
              </label>

              <div class="grid grid-cols-2 gap-2">
                <button
                  class={`px-3 py-2 rounded-xl border text-sm transition-colors ${
                    props.scope === "workspace"
                      ? "bg-gray-12/10 text-gray-12 border-gray-6/20"
                      : "text-gray-11 border-gray-6 hover:text-gray-12"
                  }`}
                  onClick={() => props.onScopeChange("workspace")}
                  type="button"
                >
                  {translate("commands.workspace")}
                </button>
                <button
                  class={`px-3 py-2 rounded-xl border text-sm transition-colors ${
                    props.scope === "global"
                      ? "bg-gray-12/10 text-gray-12 border-gray-6/20"
                      : "text-gray-11 border-gray-6 hover:text-gray-12"
                  }`}
                  onClick={() => props.onScopeChange("global")}
                  type="button"
                >
                  {translate("commands.global")}
                </button>
              </div>

              <label class="block">
                <div class="mb-1 text-xs font-medium text-gray-11">{translate("commands.template_label")}</div>
                <textarea
                  class="w-full min-h-40 rounded-xl bg-gray-2/60 px-3 py-2 text-sm text-gray-12 placeholder:text-gray-10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-gray-6/20"
                  value={props.template}
                  onInput={(event) => props.onTemplateChange(event.currentTarget.value)}
                  placeholder={translate("commands.template_placeholder")}
                />
                <div class="mt-1 text-xs text-gray-10">{translate("commands.template_hint")}</div>
              </label>
            </div>

            <div class="mt-6 flex justify-end gap-2">
              <Show
                when={props.showOverrideConfirmation}
                fallback={
                  <>
                    <Button variant="outline" onClick={props.onClose}>
                      {translate("common.cancel")}
                    </Button>
                    <Button onClick={props.onSave}>{translate("common.save")}</Button>
                  </>
                }
              >
                <Button variant="outline" onClick={props.onCancelOverride}>
                  {translate("commands.override_cancel")}
                </Button>
                <Button variant="danger" onClick={props.onSave}>
                  {translate("commands.override_confirm")}
                </Button>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
