import { getDefaultPreset } from '@/components/dashboards/widgetSizePresets'
import type {
  DashboardWidget,
  DashboardWidgetDraft,
  DashboardWidgetType,
} from '@/stores/dashboards/types'
import type { DashboardMetricDescriptor } from '@/stores/dashboards/metricCatalog'

export interface PreviewWidgetInput {
  draft?: DashboardWidgetDraft | null
  widgetId?: string
  type: DashboardWidgetType
  title: string
  dataSource: DashboardWidget['dataSource']
  metricId: DashboardWidget['metricId']
  descriptor: DashboardMetricDescriptor
}

export function buildPreviewWidget(input: PreviewWidgetInput): DashboardWidget {
  const preset = getDefaultPreset(input.type)
  return {
    id: input.widgetId ?? input.draft?.widgetId ?? 'preview-widget',
    type: input.type,
    title: input.title || input.descriptor.defaultTitle,
    dataSource: input.dataSource,
    metricId: input.metricId,
    dimension: input.draft?.dimension,
    layout: {
      x: 0,
      y: 0,
      w: preset.w,
      h: preset.h,
      minW: preset.minW,
      minH: preset.minH,
    },
    filters: input.draft?.filters,
    drilldown: input.descriptor.drilldown,
    aiProvenance: input.draft?.aiProvenance,
  }
}
