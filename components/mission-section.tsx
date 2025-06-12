import type React from "react"
import { Leaf, ShieldCheck, Users, Sparkles, Truck } from "lucide-react"

const MissionCard = ({
  icon,
  title,
  children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-8">
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-primary/20 p-3 rounded-full">{icon}</div>
      <h3 className="text-2xl font-bold text-foreground">{title}</h3>
    </div>
    <p className="text-muted-foreground">{children}</p>
  </div>
)

export default function MissionSection() {
  return (
    <section id="mission" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground">Our Mission</h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-muted-foreground">
            To redefine the cannabis experience in the Twin Cities through quality, innovation, and a commitment to our
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MissionCard icon={<Leaf className="h-8 w-8 text-primary" />} title="Uncompromising Quality">
            We showcase only premium, lab-tested cannabis products. Our curated menu ensures that every gift meets the
            highest standards of purity and potency, providing a safe and exceptional experience.
          </MissionCard>
          <MissionCard icon={<ShieldCheck className="h-8 w-8 text-primary" />} title="Safety & Trust">
            Operating within Minnesota's legal gifting framework is our top priority. We provide a transparent, secure,
            and trustworthy process, ensuring peace of mind for every member of our community.
          </MissionCard>
          <MissionCard icon={<Users className="h-8 w-8 text-primary" />} title="Community First">
            DankDeals is more than a showcase; it's a community. Our gifting model is designed to serve our neighbors in
            the Minneapolis-St. Paul area with respect, discretion, and a friendly touch.
          </MissionCard>
          <MissionCard icon={<Sparkles className="h-8 w-8 text-primary" />} title="Pioneering Innovation">
            We believe in the power of technology to enhance user experience. Our flagship AI Budtender is a testament
            to this, offering personalized, expert-level guidance to help you find the perfect product.
          </MissionCard>
          <MissionCard icon={<Truck className="h-8 w-8 text-primary" />} title="Discreet & Professional Service">
            Your privacy is paramount. From inquiry to delivery, we guarantee a professional and discreet service,
            ensuring a comfortable and confidential experience every time.
          </MissionCard>
        </div>
      </div>
    </section>
  )
}
