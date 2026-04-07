import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';

export default function Appearance() {
    return (
        <>
            <Head title="外观设置" />

            <h1 className="sr-only">外观设置</h1>

            <section className="space-y-7">
                <Heading
                    variant="small"
                    title="外观设置"
                    description="调整界面主题与显示偏好。"
                />
                <AppearanceTabs />
            </section>
        </>
    );
}
