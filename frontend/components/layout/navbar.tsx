'use client';

import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="px-4 py-2 flex justify-between items-center border-b">
      <div>
        <Link href="/" className="font-bold text-xl">
          Exam System
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span>
              {user.name}
              {user.roles === 'admin' && (
                <span className="ml-2 text-sm bg-blue-100 px-2 py-1 rounded-full">Admin</span>
              )}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="px-4 py-2 border rounded hover:bg-gray-50">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
