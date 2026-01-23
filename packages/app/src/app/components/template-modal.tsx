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

export type TemplateModalProps = {
  open: boolean;
  title: string;
  description: string;
  prompt: string;
  scope: "workspace" | "global";
  error: string | null;
  sessions: SessionOption[];
  loadingSession: boolean;
  selectedSessionId: string;
  onClose: () => void;
  onSave: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onScopeChange: (value: "workspace" | "global") => void;
  onSelectSession: (sessionId: string) => void;
};

export default function TemplateModal(props: TemplateModalProps) {
  const translate = (key: string) => t(key, currentLocale());

  // Convert sessions to Select options format
  const sessionOptions = () =>
    props.sessions.map((s) => ({ value: s.id, label: s.title }));

  // Reset select when user manually edits title, description, or prompt
  const handleManualTitleChange = (value: string) => {
    if (props.selectedSessionId) {
      props.onSelectSession(""); // Reset selection
    }
    props.onTitleChange(value);
  };

  const handleManualDescriptionChange = (value: string) => {
    if (props.selectedSessionId) {
      props.onSelectSession(""); // Reset selection
    }
    props.onDescriptionChange(value);
  };

  const handleManualPromptChange = (value: string) => {
    if (props.selectedSessionId) {
      props.onSelectSession(""); // Reset selection
    }
    props.onPromptChange(value);
  };

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 bg-gray-1/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-gray-2 border border-gray-6/70 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-12">{translate("templates.modal_title")}</h3>
                <p class="text-sm text-gray-11 mt-1">{translate("templates.modal_description")}</p>
              </div>
              <Button variant="ghost" class="!p-2 rounded-full" onClick={props.onClose}>
                <X size={16} />
              </Button>
            </div>

            <div class="mt-6 space-y-4">
              {/* Session Selector */}
              <Show when={props.sessions.length > 0}>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-11 whitespace-nowrap">Create from scratch or</span>
                  <Select
                    options={sessionOptions()}
                    value={props.selectedSessionId}
                    placeholder="select a previous session"
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
                label={translate("templates.title_label")}
                value={props.title}
                onInput={(e) => handleManualTitleChange(e.currentTarget.value)}
                placeholder={translate("templates.title_placeholder")}
                disabled={props.loadingSession}
              />

              <TextInput
                label={translate("templates.description_label")}
                value={props.description}
                onInput={(e) => handleManualDescriptionChange(e.currentTarget.value)}
                placeholder={translate("templates.description_placeholder")}
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
                  {translate("templates.workspace")}
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
                  {translate("templates.global")}
                </button>
              </div>

              <label class="block">
                <div class="mb-1 text-xs font-medium text-gray-11">{translate("templates.prompt_label")}</div>
                <textarea
                  class={`w-full min-h-40 rounded-xl bg-gray-2/60 px-3 py-2 text-sm text-gray-12 placeholder:text-gray-10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-gray-6/20 ${
                    props.loadingSession ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  value={props.prompt}
                  onInput={(e) => handleManualPromptChange(e.currentTarget.value)}
                  placeholder={translate("templates.prompt_placeholder")}
                  disabled={props.loadingSession}
                />
                <div class="mt-1 text-xs text-gray-10">{translate("templates.prompt_hint")}</div>
              </label>
            </div>

            <div class="mt-6 flex items-center justify-between gap-2">
              {/* Error message on the left */}
              <div class="flex-1">
                <Show when={props.error}>
                  <div class="text-sm text-red-11">{props.error}</div>
                </Show>
              </div>

              {/* Buttons on the right */}
              <div class="flex gap-2">
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
      </div>
    </Show>
  );
}
