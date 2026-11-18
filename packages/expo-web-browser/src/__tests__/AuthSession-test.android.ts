import { AppState, Linking } from 'react-native';

import ExpoWebBrowser from '../ExpoWebBrowser';
import { openAuthSessionAsync, WebBrowserResultType } from '../WebBrowser';

jest.mock('expo', () => ({ UnavailabilityError: Error }));

jest.mock('../ExpoWebBrowser', () => ({
  openBrowserAsync: jest.fn(),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
  AppState: { currentState: 'active', addEventListener: jest.fn() },
  Linking: { addEventListener: jest.fn(() => ({ remove: mockRemoveRedirect })) },
  processColor: (value: unknown) => value,
}));

const startUrl = 'https://auth.example/start';
const returnUrl = 'example://callback';
const mockRemoveRedirect = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(AppState.addEventListener).mockReturnValue({ remove: jest.fn() });
  ExpoWebBrowser.openBrowserAsync.mockResolvedValue({ type: WebBrowserResultType.OPENED });
});

it('dismisses a session whose browser closed while the app stayed active', async () => {
  // In split-screen and freeform windows, AppState does not change when the browser closes.
  const first = openAuthSessionAsync(startUrl, returnUrl);
  await new Promise<void>((resolve) => setImmediate(resolve));

  const second = openAuthSessionAsync(startUrl, returnUrl);
  await new Promise<void>((resolve) => setImmediate(resolve));
  jest.mocked(Linking.addEventListener).mock.calls.at(-1)![1]({ url: returnUrl });

  await expect(second).resolves.toEqual({ type: 'success', url: returnUrl });
  await expect(first).resolves.toEqual({ type: WebBrowserResultType.DISMISS });
  expect(mockRemoveRedirect).toHaveBeenCalledTimes(2);
});
