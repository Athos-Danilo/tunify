from datetime import datetime, timezone
from app.services.peak_time import month_window, summarize_periods


def test_month_starts_at_brazil_midnight():
    start, end = month_window(datetime(2026, 10, 18, 15, tzinfo=timezone.utc))
    assert start == datetime(2026, 10, 1, 3, tzinfo=timezone.utc)
    assert end == datetime(2026, 10, 18, 15, tzinfo=timezone.utc)


def test_utc_month_change_still_belongs_to_previous_brazil_month():
    start, _ = month_window(datetime(2026, 11, 1, 2, 59, tzinfo=timezone.utc))
    assert start == datetime(2026, 10, 1, 3, tzinfo=timezone.utc)
    start, _ = month_window(datetime(2026, 11, 1, 3, tzinfo=timezone.utc))
    assert start == datetime(2026, 11, 1, 3, tzinfo=timezone.utc)


def test_year_change():
    start, _ = month_window(datetime(2027, 1, 1, 1, tzinfo=timezone.utc))
    assert start == datetime(2026, 12, 1, 3, tzinfo=timezone.utc)


def test_tie_and_empty():
    result = summarize_periods([10, 10, 0, 0])
    assert result['dominantes'] == ['madrugada', 'manha']
    assert result['total_plays'] == 20
    empty = summarize_periods([0, 0, 0, 0])
    assert empty['dominantes'] == []
    assert empty['dominante'] == 'nenhum'


def test_single_winner_and_total():
    result = summarize_periods([2, 3, 8, 1])
    assert result['dominantes'] == ['tarde']
    assert result['total_plays'] == 14
