import { ButtonItem, Navigation, PanelSection, PanelSectionRow, ToggleField } from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { FaSave } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { ApiClient } from "../helpers/apiClient";
import Head from "../components/Head";
import DeckyStoreButton from "../components/DeckyStoreButton";
import { ApplicationState } from "../helpers/state";
import { Translator } from "../helpers/translator";
import { Logger } from "../helpers/logger";

// TODO
export const Content: VFC<{}> = () => {
  const appState = ApplicationState.useAppState();

  const [hasProvider, setHasProvider] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    ApiClient.getCloudBackend().then((e) => setHasProvider(!!e));
  }, []);

  return (
    <>
      <Head />
      <PanelSection title={Translator.translate("sync")}>
        <PanelSectionRow>
          <ButtonItem layout="below" disabled={appState.syncing === "true" || !hasProvider} onClick={() => {
            Logger.info("Synchronizing"); 
            ApiClient.syncNow(true); 
          }}>
            <DeckyStoreButton icon={<FaSave className={appState.syncing === "true" ? "dcs-rotate" : ""} />}>{Translator.translate("sync.now")}</DeckyStoreButton>
          </ButtonItem>
          {hasProvider === false && <small>{Translator.translate("provider.not.configured")}.</small>}
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={Translator.translate("configuration")}>
        <PanelSectionRow>
          <ToggleField
            label={Translator.translate("sync.start.stop")}
            checked={appState.sync_on_game_exit === "true"}
            onChange={(e) => ApplicationState.setAppState("sync_on_game_exit", e ? "true" : "false", true)}
          />
          <ToggleField
            disabled={appState.sync_on_game_exit != "true"}
            label={Translator.translate("toast.auto.sync")}
            checked={appState.toast_auto_sync === "true"}
            onChange={(e) => ApplicationState.setAppState("toast_auto_sync", e ? "true" : "false", true)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => {
              Navigation.CloseSideMenus();
              Navigation.Navigate("/dcs-configure-paths");
            }}
          >
            <DeckyStoreButton icon={<FiEdit3 />}>{Translator.translate("sync.paths")}</DeckyStoreButton>
          </ButtonItem>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => {
              Navigation.CloseSideMenus();
              Navigation.Navigate("/dcs-configure-backend");
            }}
          >
            <DeckyStoreButton icon={<AiOutlineCloudUpload />}>{Translator.translate("cloud.provider")}</DeckyStoreButton>
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title={Translator.translate("experimental.use.risk")}>
        <PanelSectionRow>
          <ToggleField
            label={Translator.translate("bidirectional.sync")}
            checked={appState.bisync_enabled === "true"}
            onChange={(e) => ApplicationState.setAppState("bisync_enabled", e ? "true" : "false", true)}
          />
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};
