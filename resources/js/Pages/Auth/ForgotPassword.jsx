import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
                <p className="text-xs text-indigo-200/70">Request a recovery link via email</p>
            </div>

            <div className="mb-6 text-xs text-indigo-200/80 leading-relaxed text-center">
                Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one.
            </div>

            {status && <div className="mb-4 font-semibold text-sm text-green-400 text-center">{status}</div>}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full !bg-slate-900/60 !border-white/15 !text-white placeholder-white/30 focus:!border-indigo-400 focus:ring-indigo-400 focus:!bg-slate-900/80"
                        isFocused={true}
                        placeholder="john.doe@smartinv.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-red-300" />
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center !bg-indigo-600 hover:!bg-indigo-500 !text-white active:!bg-indigo-700 focus:ring-indigo-400 border-none py-2.5 rounded-lg shadow-lg font-bold text-xs transition-all" 
                        disabled={processing}
                    >
                        {processing ? 'Sending Link...' : 'Email Password Reset Link'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 text-center border-t border-white/10 pt-4">
                <Link 
                    href={route('login')} 
                    className="text-xs font-bold text-indigo-300 hover:text-indigo-200 hover:underline inline-flex items-center gap-1 justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-sm" /> Back to Sign In
                </Link>
            </div>
        </GuestLayout>
    );
}
