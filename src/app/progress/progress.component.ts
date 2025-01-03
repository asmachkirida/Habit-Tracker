import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  habitsCheckedData: { date: string; checked: number }[] = [
    { date: 'Mon', checked: 0 },
    { date: 'Tue', checked: 0 },
    { date: 'Wed', checked: 0 },
    { date: 'Thu', checked: 0 },
    { date: 'Fri', checked: 0 },
    { date: 'Sat', checked: 0 },
    { date: 'Sun', checked: 0 },
  ];

  habitsCheckedChartOption: EChartsOption = {};
  habitsRatioChartOption: EChartsOption = {};
  quote: string = '';

  habitsRatioData: { date: string; ratio: number }[] = [
    { date: 'Mon', ratio: 0 },
    { date: 'Tue', ratio: 0 },
    { date: 'Wed', ratio: 0 },
    { date: 'Thu', ratio: 0 },
    { date: 'Fri', ratio: 0 },
    { date: 'Sat', ratio: 0 },
    { date: 'Sun', ratio: 0 },
  ];

  private chartColors = ['#386641', '#6A994E', '#A7C957', '#F2E8CF', '#BC4749'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchHabitsCheckedData();
    this.fetchHabitsRatioData();  // Added to fetch the ratio data
    this.fetchQuoteOfTheDay();
  }

  fetchHabitsCheckedData(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      return;
    }

    this.http.post<any[]>('http://77.37.86.136:8002/chart/column/read', userId, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    }).subscribe(
      (response) => {
        console.log('Response from the backend:', response);
        if (response && response.length > 0) {
          const todayData = response[0].numberCheckedHabit || 0;
          const todayIndex = new Date().getDay() - 1;
          this.habitsCheckedData[todayIndex].checked = todayData;
          this.updateHabitsCheckedChart();
        } else {
          console.log('No data received from the backend.');
        }
      },
      (error) => {
        console.error('Error fetching habits checked data:', error);
        this.updateHabitsCheckedChart();
      }
    );
  }

  updateHabitsCheckedChart(): void {
    this.habitsCheckedChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: { top: 30, right: 20, bottom: 40, left: 50 },
      xAxis: {
        type: 'category',
        data: this.habitsCheckedData.map((item) => item.date),
        axisLine: { lineStyle: { color: '#344e41' } },
        axisLabel: { color: '#6A994E' },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#344e41' } },
        axisLabel: { color: '#6A994E' },
        splitLine: { lineStyle: { color: '#e0e0e0' } },
      },
      series: [
        {
          type: 'bar',
          data: this.habitsCheckedData.map((item, index) => ({
            value: item.checked,
            itemStyle: { color: this.chartColors[index % this.chartColors.length] },
          })),
        },
      ],
    };
  }

  fetchHabitsRatioData(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      return;
    }

    this.http.post<any[]>('http://77.37.86.136:8002/chart/area/read', userId, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    }).subscribe(
      (response) => {
        console.log('Response from the backend for ratio chart:', response);
        const ratioData = [
          { date: 'Mon', ratio: 0 },
          { date: 'Tue', ratio: 0 },
          { date: 'Wed', ratio: 0 },
          { date: 'Thu', ratio: 0 },
          { date: 'Fri', ratio: 0 },
          { date: 'Sat', ratio: 0 },
          { date: 'Sun', ratio: 0 },
        ];

        if (response && response.length > 0) {
          response.forEach((data: any) => {
            const dateIndex = new Date(data.date).getDay() - 1;
            const ratio = data.numberTotalHabit > 0 ? data.numberCheckedHabit / data.numberTotalHabit : 0;
            ratioData[dateIndex].ratio = ratio;
          });
        }

        this.habitsRatioData = ratioData;
        this.updateHabitsRatioChart();
      },
      (error) => {
        console.error('Error fetching habits ratio data:', error);
        this.updateHabitsRatioChart();
      }
    );
  }

  updateHabitsRatioChart(): void {
    this.habitsRatioChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: { top: 30, right: 20, bottom: 40, left: 50 },
      xAxis: {
        type: 'category',
        data: this.habitsRatioData.map((item) => item.date),
        axisLine: { lineStyle: { color: '#344e41' } },
        axisLabel: { color: '#6A994E' },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#344e41' } },
        axisLabel: { color: '#6A994E' },
        splitLine: { lineStyle: { color: '#e0e0e0' } },
      },
      series: [
        {
          type: 'line',
          data: this.habitsRatioData.map((item, index) => ({
            value: item.ratio,
            itemStyle: { color: this.chartColors[index % this.chartColors.length] },
          })),
          smooth: true,
        },
      ],
    };
  }

  fetchQuoteOfTheDay(): void {
    this.http.get<{ message: string }>('http://77.37.86.136:8002/quote/today').subscribe(
      (response) => {
        this.quote = response.message;
      },
      (error) => {
        console.error('Error fetching quote of the day:', error);
      }
    );
  }
}
