import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white mb-1">Set New Password</h1>
                <p className="text-xs text-indigo-200/70">Create a secure password for your account</p>
            </div>

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
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-red-300" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-white/90 font-medium" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full !bg-slate-900/60 !border-white/15 !text-white placeholder-white/30 focus:!border-indigo-400 focus:ring-indigo-400 focus:!bg-slate-900/80"
                        autoComplete="new-password"
                        isFocused={true}
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-red-300" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-white/90 font-medium" />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full !bg-slate-900/60 !border-white/15 !text-white placeholder-white/30 focus:!border-indigo-400 focus:ring-indigo-400 focus:!bg-slate-900/80"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />

                    <InputError message={errors.password_confirmation} className="mt-2 text-red-300" />
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center !bg-indigo-600 hover:!bg-indigo-500 !text-white active:!bg-indigo-700 focus:ring-indigo-400 border-none py-2.5 rounded-lg shadow-lg font-bold text-sm transition-all" 
                        disabled={processing}
                    >
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
