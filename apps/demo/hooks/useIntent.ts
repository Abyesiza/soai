import { useAtom } from 'jotai';
import { intentAtom } from '../lib/store/intentStore';

export function useIntent() {
    const [intent, setIntent] = useAtom(intentAtom);

    return { intent, setIntent };
}
