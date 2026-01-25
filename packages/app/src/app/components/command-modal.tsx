import { Show } from "solid-js";

import { X, Loader2 } from "lucide-solid";
import { t, currentLocale } from "../../i18n";

import Button from "./button";
import TextInput from "./text-input";
import Select from "./select";

export type SessionOption = {
  id: string;
  title: string;
};

export type ReferenceSession = {
  id: string;
  title: string;
};

export type CommandModalProps = {
  open: boolean;
  name: string;
  description: string;
  template: string;
  scope: "workspace" | "global";
  sessions: SessionOption[];
  loadingSession: boolean;
  selectedSessionId: string;
  referenceSession?: ReferenceSession;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTemplateChange: (value: string) => void;
  onScopeChange: (value: "workspace" | "global") => void;
  onSelectSession: (sessionId: string) => void;
};

export default function CommandModal(props: CommandModalProps) {
  const translate = (key: string) => t(key, currentLocale());

  // Convert sessions to Select options format
  const sessionOptions = () =>
    props.sessions.map((s) => ({ value: s.id, label: s.title }));

  // Reset select when user manually edits name, description, or template
  const handleManualNameChange = (value: string) => {
    if (props.selectedSessionId) {
      props.onSelectSession(""); // Reset selection
    }
    props.onNameChange(value);
  };

  const handleManualDescriptionChange = (value: string) => {
    if (props.selectedSessionId) {
      props.onSelectSession(""); // Reset selection
    }
    props.onDescriptionChange(value);
  };

  const handleManualTemplateChange = (value: string) => {
    if (props.selectedSessionId) {
      props.onSelectSession(""); // Reset selection
    }
    props.onTemplateChange(value);
  };

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 bg-gray-1/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-gray-2 border border-gray-6/70 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-12">{translate("commands.modal_title")}</h3>
                <p class="text-sm text-gray-11 mt-1">{translate("commands.modal_description")}</p>
              </div>
              <Button variant="ghost" class="!p-2 rounded-full" onClick={props.onClose}>
                <X size={16} />
              </Button>
            </div>

            <div class="mt-6 space-y-4">
              {/* Session Reference - fixed when opened from session list */}
              <Show when={props.referenceSession}>
                <div class="flex items-center gap-2 text-xs text-gray-11">
                  <span>Based on</span>
                  <span class="font-semibold text-gray-12">{props.referenceSession?.title}</span>
                </div>
              </Show>

              {/* Session Selector - only shown when no reference session */}
              <Show when={!props.referenceSession && props.sessions.length > 0}>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-11 whitespace-nowrap">Create from scratch or</span>
                  <Select
                    options={sessionOptions()}
                    value={props.selectedSessionId}
                    placeholder="select a previous session as reference"
                    disabled={props.loadingSession}
                    onChange={props.onSelectSession}
                    class="flex-1"
                  />
                  <Show when={props.loadingSession}>
                    <Loader2 size={14} class="text-gray-10 animate-spin shrink-0" />
                  </Show>
                </div>
              </Show>

              <TextInput
                label={translate("commands.name_label")}
                value={props.name}
                onInput={(event) => handleManualNameChange(event.currentTarget.value)}
                placeholder={translate("commands.name_placeholder")}
                hint={translate("commands.name_hint")}
                disabled={props.loadingSession}
              />

              <TextInput
                label={translate("commands.description_label")}
                value={props.description}
                onInput={(event) => handleManualDescriptionChange(event.currentTarget.value)}
                placeholder={translate("commands.description_placeholder")}
                disabled={props.loadingSession}
              />

              <div class="grid grid-cols-2 gap-2">
                <button
                  class={`px-3 py-2 rounded-xl border text-sm transition-colors ${
                    props.scope === "workspace"
                      ? "bg-gray-12/10 text-gray-12 border-gray-6/20"
                      : "text-gray-11 border-gray-6 hover:text-gray-12"
                  } ${props.loadingSession ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !props.loadingSession && props.onScopeChange("workspace")}
                  type="button"
                  disabled={props.loadingSession}
                >
                  {translate("commands.workspace")}
                </button>
                <button
                  class={`px-3 py-2 rounded-xl border text-sm transition-colors ${
                    props.scope === "global"
                      ? "bg-gray-12/10 text-gray-12 border-gray-6/20"
                      : "text-gray-11 border-gray-6 hover:text-gray-12"
                  } ${props.loadingSession ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !props.loadingSession && props.onScopeChange("global")}
                  type="button"
                  disabled={props.loadingSession}
                >
                  {translate("commands.global")}
                </button>
              </div>

              <label class="block">
                <div class="mb-1 text-xs font-medium text-gray-11">{translate("commands.template_label")}</div>
                <textarea
                  class={`w-full min-h-40 rounded-xl bg-gray-2/60 px-3 py-2 text-sm text-gray-12 placeholder:text-gray-10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-gray-6/20 ${
                    props.loadingSession ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  value={props.template}
                  onInput={(event) => handleManualTemplateChange(event.currentTarget.value)}
                  placeholder={translate("commands.template_placeholder")}
                  disabled={props.loadingSession}
                />
                <div class="mt-1 text-xs text-gray-10">{translate("commands.template_hint")}</div>
              </label>
            </div>

            <div class="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={props.onClose} disabled={props.loadingSession}>
                {translate("common.cancel")}
              </Button>
              <Button onClick={props.onSave} disabled={props.loadingSession}>
                {translate("common.save")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
