import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

export const StatsCards = () => {
  const stats = [
    {
      title: "Total Rendez-vous",
      value: "245",
      icon: Calendar,
      bgColor: "bg-gradient-to-br from-card to-primary-light",
      iconColor: "text-primary"
    },
    {
      title: "Confirmés",
      value: "189",
      icon: CheckCircle,
      bgColor: "bg-gradient-to-br from-card to-medical-light",
      iconColor: "text-medical-green"
    },
    {
      title: "En attente",
      value: "32",
      icon: Clock,
      bgColor: "bg-gradient-to-br from-card to-orange-50",
      iconColor: "text-medical-orange"
    },
    {
      title: "Annulés",
      value: "24",
      icon: XCircle,
      bgColor: "bg-gradient-to-br from-card to-red-50",
      iconColor: "text-medical-red"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`${stat.bgColor} border-0 shadow-soft hover:shadow-medical transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
