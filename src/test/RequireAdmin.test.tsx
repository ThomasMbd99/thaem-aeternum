import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RequireAdmin from '@/components/RequireAdmin';

const mocks = vi.hoisted(() => ({
  auth: { user: null, session: null, loading: false } as {
    user: { id: string; email?: string; user_metadata?: object } | null;
    session: { access_token: string } | null;
    loading: boolean;
  },
  rpc: vi.fn(),
  mounted: vi.fn(),
}));
vi.mock('@/context/AuthContext', () => ({ useAuth: () => mocks.auth }));
vi.mock('@/lib/supabase', () => ({ supabase: { rpc: mocks.rpc } }));

function AdminContent() {
  mocks.mounted();
  return <p>Administration privée</p>;
}
const view = () => <MemoryRouter initialEntries={['/admin']}><Routes>
  <Route path="/admin" element={<RequireAdmin><AdminContent /></RequireAdmin>} />
  <Route path="/login" element={<p>Connexion</p>} />
</Routes></MemoryRouter>;

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth = { user: { id: 'customer' }, session: { access_token: 'token' }, loading: false };
});
afterEach(cleanup);

describe('Admin authorization', () => {
  it('redirects a visitor without mounting admin queries', () => {
    mocks.auth.user = null;
    mocks.auth.session = null;
    render(view());
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(mocks.mounted).not.toHaveBeenCalled();
  });

  it('does not mount content while authorization is pending', () => {
    mocks.rpc.mockReturnValue(new Promise(() => {}));
    render(view());
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(mocks.mounted).not.toHaveBeenCalled();
  });

  it.each([
    { data: false, error: null },
    { data: true, error: { message: 'RPC failed' } },
    { data: null, error: null },
    { data: 'true', error: null },
  ])('fails closed for an unauthorized or invalid response: %j', async response => {
    mocks.auth.user = { id: 'customer', email: 'admin@example.com', user_metadata: { role: 'admin' } };
    mocks.rpc.mockResolvedValue(response);
    render(view());
    expect(await screen.findByRole('alert')).toHaveTextContent('Accès refusé');
    expect(mocks.mounted).not.toHaveBeenCalled();
  });

  it('fails closed on a network exception', async () => {
    mocks.rpc.mockRejectedValue(new Error('offline'));
    render(view());
    await screen.findByRole('alert');
    expect(mocks.mounted).not.toHaveBeenCalled();
  });

  it('mounts admin content only after server approval', async () => {
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    render(view());
    expect(await screen.findByText('Administration privée')).toBeInTheDocument();
    expect(mocks.rpc).toHaveBeenCalledWith('is_admin');
  });

  it('ignores an approval that arrives after switching accounts', async () => {
    let approve!: (value: object) => void;
    mocks.rpc.mockReturnValueOnce(new Promise(resolve => { approve = resolve; }))
      .mockResolvedValueOnce({ data: false, error: null });
    const { rerender } = render(view());
    mocks.auth = { user: { id: 'other' }, session: { access_token: 'other-token' }, loading: false };
    rerender(view());
    await screen.findByRole('alert');
    await act(async () => approve({ data: true, error: null }));
    expect(mocks.mounted).not.toHaveBeenCalled();
  });

  it('immediately removes approved content on logout', async () => {
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    const { rerender } = render(view());
    await screen.findByText('Administration privée');
    mocks.auth = { user: null, session: null, loading: false };
    rerender(view());
    await waitFor(() => expect(screen.queryByText('Administration privée')).not.toBeInTheDocument());
    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });
});
