import DynamicTextDemo from "./dynamic-text-demo"
import { headers } from 'next/headers'


export default async function Page() {
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language')
    const locale = acceptLanguage?.split(';')[0]?.split(',')[0] || 'en-GB'
    return <>
        {/* <h1>Locale: {locale}</h1> */}
        <DynamicTextDemo locale={locale} />
    </>
}