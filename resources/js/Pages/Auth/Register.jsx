import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
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
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
                <p className="text-xs text-indigo-200/70">Register a new system user profile</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Full Name" className="text-white/90 font-medium" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-indigo-400 focus:ring-indigo-400 focus:bg-white/10"
                        autoComplete="name"
                        isFocused={true}
                        placeholder="John Doe"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2 text-red-300" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="text-white/90 font-medium" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-indigo-400 focus:ring-indigo-400 focus:bg-white/10"
                        autoComplete="username"
                        placeholder="john.doe@smartinv.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-indigo-400 focus:ring-indigo-400 focus:bg-white/10"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-red-300" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-white/90 font-medium" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-indigo-400 focus:ring-indigo-400 focus:bg-white/10"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2 text-red-300" />
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center bg-indigo-600 hover:bg-indigo-500 text-white active:bg-indigo-700 focus:ring-indigo-400 border-none py-2.5 rounded-lg shadow-lg font-bold text-sm transition-all" 
                        disabled={processing}
                    >
                        {processing ? 'Creating account...' : 'Register'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 text-center border-t border-white/10 pt-4">
                <span className="text-xs text-white/60">Already registered? </span>
                <Link href={route('login')} className="text-xs font-bold text-indigo-300 hover:text-indigo-200 hover:underline">
                    Sign In
                </Link>
            </div>
        </GuestLayout>
    );
}
