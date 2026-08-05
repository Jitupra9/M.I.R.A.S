import { Check, Crown, X } from "lucide-react";
import { memo } from "react";

const UpgradeModal = ({ onClose }: { onClose: () => void }) => {
  const plans = [
    {
      name: "Pro",
      price: "$20",
      period: "/month",
      features: [
        "Unlimited chats",
        "Priority support",
        "Advanced models",
        "File uploads up to 100MB",
      ],
      popular: true,
    },
    {
      name: "Team",
      price: "$50",
      period: "/month",
      features: [
        "Everything in Pro",
        "5 team members",
        "Shared workspace",
        "Admin controls",
        "Analytics",
      ],
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Upgrade to Pro</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-muted-foreground text-sm mb-6">
            Unlock the full potential of MindLeaf with our premium plans.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-5 ${
                  plan.popular
                    ? "border-primary bg-primary/5"
                    : "border-border bg-secondary/30"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Popular
                  </span>
                )}
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  {"Get"} {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(UpgradeModal);
