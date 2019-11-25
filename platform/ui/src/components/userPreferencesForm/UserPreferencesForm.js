import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './UserPreferencesForm.styl';

import { useTranslation } from 'react-i18next';

// Tabs Component wrapper
import { UserPreferencesTabs } from './UserPreferencesTabs';

// Tabs
import { HotKeysPreferences } from './HotKeysPreferences';
import { WindowLevelPreferences } from './WindowLevelPreferences';
import { GeneralPreferences } from './GeneralPreferences';

/**
 @typedef TabObject
 @type {Object}
 @property {string} name Name for given tab
 @property {ReactComponent} Component React component for given tab.
 @property {object} initialState Initial State for given tab component
 @property {object} props Props State for given tab component
 @property {boolean} [hidden] To hidden tab or not
 */

/**
 * Create tabs obj.
 * Each tab obj must have 'name', 'Component',
 * @param {object} windowLevelData
 * @param {object} hotkeyDefinitions
 *
 * @returns {TabObject[]} Array of TabObjs.
 */
const createTabs = (windowLevelData, hotkeyDefinitions) => {
  return [
    {
      name: 'Hotkeys',
      Component: HotKeysPreferences,
      initialState: { hotkeyDefinitions },
      props: {},
    },
    {
      name: 'General',
      Component: GeneralPreferences,
      initialState: {},
      props: {},
    },
    {
      name: 'Window Level',
      Component: WindowLevelPreferences,
      initialState: { windowLevelData },
      props: {},
      hidden: true,
    },
  ];
};

/**
 * Main form component to render preferences tabs and buttons
 * @param {object} props component props
 * @param {string} props.name Tab`s name
 * @param {object} props.hotkeyDefinitions Hotkeys Data
 * @param {object} props.windowLevelData Window level data
 * @param {function} props.onSave Callback function when saving
 * @param {function} props.onClose Callback function when closing
 * @param {function} props.onResetToDefaults Callback function when resetting
 */
function UserPreferencesForm({
  onClose,
  onSave,
  onResetToDefaults,
  windowLevelData,
  hotkeyDefinitions,
}) {
  const tabs = createTabs(windowLevelData, hotkeyDefinitions);
  const [tabsState, setTabsState] = useState(
    tabs.reduce((acc, tab) => {
      acc[tab.name] = tab.initialState;
      return acc;
    }, {})
  );

  const [tabsError, setTabsError] = useState(
    tabs.reduce((acc, tab) => {
      acc[tab.name] = false;
      return acc;
    }, {})
  );

  const { t, ready: translationsAreReady } = useTranslation(
    'UserPreferencesForm'
  );

  const onTabStateChanged = (tabName, newState) => {
    setTabsState({ ...tabsState, [tabName]: newState });
  };

  const onTabErrorChanged = (tabName, hasError) => {
    setTabsError({ ...tabsError, [tabName]: hasError });
  };

  const hasAnyError = () => {
    return Object.values(tabsError).reduce((acc, value) => acc || value);
  };

  return translationsAreReady ? (
    <div className="UserPreferencesForm">
      <UserPreferencesTabs
        tabs={tabs}
        onTabStateChanged={onTabStateChanged}
        onTabErrorChanged={onTabErrorChanged}
      />
      <div className="footer">
        <button
          data-cy="reset-default-btn"
          className="btn btn-danger pull-left"
          onClick={onResetToDefaults}
        >
          {t('Reset to Defaults')}
        </button>
        <div>
          <div
            data-cy="cancel-btn"
            onClick={onClose}
            className="btn btn-default"
          >
            {t('Cancel')}
          </div>
          <button
            data-cy="save-btn"
            className="btn btn-primary"
            disabled={hasAnyError()}
            onClick={event => {
              // TODO to check this method for other tabs than Hotkeys
              const toSave = Object.values(tabsState).reduce(
                (acc, tabState) => {
                  return { ...acc, ...tabState };
                },
                {}
              );
              onSave(toSave);
            }}
          >
            {t('Save')}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

UserPreferencesForm.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onResetToDefaults: PropTypes.func,
  windowLevelData: PropTypes.object,
  hotkeyDefinitions: PropTypes.object,
};

export { UserPreferencesForm };
