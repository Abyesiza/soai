export interface DashboardMetric {
    label: string;
    value: string;
    change: string;
    changeDirection: 'up' | 'down' | 'flat';
}

export interface DashboardChartDataPoint {
    label: string;
    value: number;
}

export interface DashboardChart {
    title: string;
    type: 'bar' | 'line' | 'donut';
    data: DashboardChartDataPoint[];
}

export interface DashboardTableColumn {
    key: string;
    label: string;
}

export interface DashboardTable {
    title: string;
    columns: DashboardTableColumn[];
    rows: string[][];
}

export interface DashboardSpec {
    title: string;
    subtitle: string;
    metrics: DashboardMetric[];
    charts: DashboardChart[];
    tables: DashboardTable[];
}
