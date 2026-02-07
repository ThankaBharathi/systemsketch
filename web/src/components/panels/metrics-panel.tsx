// components/panels/metrics-panel.tsx
'use client';

import { Activity, Database, Zap, Clock, Users, Server } from 'lucide-react';

interface MetricsPanelProps {
  nodeCount: number;
  connectionCount: number;
  estimatedQPS?: string;
  estimatedLatency?: string;
}

export function MetricsPanel({
  nodeCount,
  connectionCount,
  estimatedQPS = '~10K',
  estimatedLatency = '<100ms',
}: MetricsPanelProps) {
  const metrics = [
    {
      label: 'Components',
      value: nodeCount.toString(),
      icon: Server,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Connections',
      value: connectionCount.toString(),
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Est. QPS',
      value: estimatedQPS,
      icon: Zap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Est. Latency',
      value: estimatedLatency,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex items-center gap-3 p-3 bg-white rounded-lg"
        >
          <div className={`p-2 ${metric.bgColor} rounded-lg`}>
            <metric.icon size={18} className={metric.color} />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}