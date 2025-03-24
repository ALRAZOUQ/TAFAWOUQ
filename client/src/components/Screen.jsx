export default function Screen({children,className}) {
return (
<div className={`min-h-screen max-h-max bg-gradient-to-b from-TAF-200 via-white to-TAF-200 ${className}`}>
{children}
</div>

)
}