import { Config } from '../interfaces/interfaces';
export interface SettingsService {
    get(): Config;
    set(settings: Config): unknown;
    build(settings: Config): Config;
}
declare const settingsService: () => SettingsService;
export default settingsService;
