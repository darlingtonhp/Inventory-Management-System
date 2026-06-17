import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
                <p className="text-xs text-indigo-200/70">Sign in to manage your inventory</p>
            </div>

            {status && <div className="mb-4 font-semibold text-sm text-green-400">{status}</div>}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="text-white/90 font-medium" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full !bg-slate-900/60 !border-white/15 !text-white placeholder-white/30 focus:!border-indigo-400 focus:ring-indigo-400 focus:!bg-slate-900/80"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="admin@smartinv.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-red-300" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-white/90 font-medium" />

                    <div className="relative mt-1">
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="block w-full !bg-slate-900/60 !border-white/15 !text-white placeholder-white/30 focus:!border-indigo-400 focus:ring-indigo-400 focus:!bg-slate-900/80 pr-10"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors"
                        >
                            <i className={showPassword ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"} />
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2 text-red-300" />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="bg-white/5 border-white/20 text-indigo-600 focus:ring-indigo-500 rounded"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-xs text-white/80">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-indigo-300 hover:text-indigo-200 transition-colors hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center !bg-indigo-600 hover:!bg-indigo-500 !text-white active:!bg-indigo-700 focus:ring-indigo-400 border-none py-2.5 rounded-lg shadow-lg font-bold text-sm transition-all" 
                        disabled={processing}
                    >
                        {processing ? 'Signing in...' : 'Sign In'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 text-center border-t border-white/10 pt-4">
                <span className="text-xs text-white/60">Don't have an account? </span>
                <Link href={route('register')} className="text-xs font-bold text-indigo-300 hover:text-indigo-200 hover:underline">
                    Create Account
                </Link>
            </div>
        </GuestLayout>
    );
}
