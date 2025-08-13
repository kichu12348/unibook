// screens/ForumHead/CalendarScreen.tsx
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useForumHeadStore } from "../../store/forumHeadStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import EventDayView from "../../components/Modals/EventDayView";
import { Event } from "../../api/forum";
import { TAB_BAR_HEIGHT } from "../../constants/constants";

const { width } = Dimensions.get("window");
const CELL_SIZE = (width - 80) / 7;

const CalendarScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { monthlyEvents, getMonthlyEvents } = useForumHeadStore();

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{
    date: string;
    events: Event[];
  } | null>(null);

  useEffect(() => {
    getMonthlyEvents(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);
  }, [selectedMonth, getMonthlyEvents]);

  const eventLookup = useMemo(() => {
    const lookup = new Map<string, Event[]>();
    monthlyEvents.forEach((event) => {
      const key = format(new Date(event.startTime), "yyyy-MM-dd");
      const existing = lookup.get(key) || [];
      lookup.set(key, [...existing, event]);
    });
    return lookup;
  }, [monthlyEvents]);

  // Generate the weeks and days for the calendar grid
  const calendarWeeks = useMemo(() => {
    const weeks = [];
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    let currentWeekStart = startOfWeek(monthStart);

    while (currentWeekStart <= monthEnd) {
      const days = eachDayOfInterval({
        start: currentWeekStart,
        end: endOfWeek(currentWeekStart),
      });
      weeks.push(
        days.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const eventsForDay = eventLookup.get(dateKey) || [];
          return {
            date: dateKey,
            isCurrentMonth: date >= monthStart && date <= monthEnd,
            isToday: isToday(date),
            events: eventsForDay,
          };
        })
      );
      currentWeekStart = new Date(
        currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000
      );
    }
    return weeks;
  }, [selectedMonth, eventLookup]);

  const stats = useMemo(() => {
    const totalEvents = monthlyEvents.length;
    const bookedDays = new Set(
      monthlyEvents.map((e) => format(new Date(e.startTime), "yyyy-MM-dd"))
    ).size;
    return { totalEvents, bookedDays };
  }, [monthlyEvents]);

  const handlePreviousMonth = useCallback(
    () => setSelectedMonth((prev) => subMonths(prev, 1)),
    []
  );
  const handleNextMonth = useCallback(
    () => setSelectedMonth((prev) => addMonths(prev, 1)),
    []
  );
  const handleCellPress = useCallback(
    (day: { date: string; events: Event[] }) => {
      if (day.events.length > 0) {
        setSelectedDay(day);
      }
    },
    []
  );

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Events Calendar</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Month Overview</Text>
          <View style={styles.statsContainer}>
            <View
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <Text style={styles.statValue}>{stats.totalEvents}</Text>
              <Text style={styles.statTitle}>Total Events</Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <Text style={styles.statValue}>{stats.bookedDays}</Text>
              <Text style={styles.statTitle}>Booked Days</Text>
            </View>
          </View>
        </View>

        {/* Calendar Grid Section */}
        <View style={styles.section}>
          <View
            style={[styles.gridContainer, { backgroundColor: colors.surface }]}
          >
            <View style={styles.monthSelector}>
              <TouchableOpacity onPress={handlePreviousMonth}>
                <Ionicons name="chevron-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>
                {format(selectedMonth, "MMMM yyyy")}
              </Text>
              <TouchableOpacity onPress={handleNextMonth}>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              <View style={styles.dayLabelsRow}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <Text key={i} style={styles.dayLabel}>
                    {d}
                  </Text>
                ))}
              </View>
              {calendarWeeks.map((week, i) => (
                <View key={i} style={styles.weekRow}>
                  {week.map(
                    (
                      day: {
                        date: string;
                        events: Event[];
                        isToday: boolean;
                        isCurrentMonth: boolean;
                      },
                      j: number
                    ) => {
                      const isBooked = day.events.length > 0;
                      return (
                        <TouchableOpacity
                          key={j}
                          style={[
                            styles.cell,
                            isBooked && styles.bookedCell,
                            day.isToday && styles.todayCell,
                          ]}
                          onPress={() => handleCellPress(day)}
                          disabled={!day.isCurrentMonth}
                        >
                          <Text
                            style={[
                              styles.dayNumber,
                              !day.isCurrentMonth && styles.dayNotInMonth,
                              isBooked && styles.bookedDayNumber,
                              day.isToday && styles.todayDayNumber,
                            ]}
                          >
                            {new Date(day.date).getDate()}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      {selectedDay && (
        <EventDayView
          isVisible={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          data={selectedDay}
        />
      )}
    </View>
  );
};

// --- Styles ---
const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
    },
    title: { fontSize: 28, fontWeight: "bold", color: colors.text },
    section: { paddingHorizontal: 24, marginVertical: 20 },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 16,
    },
    statCard: {
      flex: 1,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    statValue: { fontSize: 30, fontWeight: "bold", color: colors.text },
    statTitle: { fontSize: 16, color: colors.textSecondary, marginTop: 6 },
    gridContainer: { borderRadius: 16, padding: 20, elevation: 2 },
    monthSelector: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    monthTitle: { fontSize: 18, fontWeight: "bold", color: colors.text },
    grid: { alignItems: "center" },
    dayLabelsRow: {
      flexDirection: "row",
      width: "100%",
      marginBottom: 12,
      justifyContent: "space-around",
    },
    dayLabel: {
      textAlign: "center",
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    weekRow: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-around",
      marginBottom: 8,
    },
    cell: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      borderRadius: CELL_SIZE / 2,
      justifyContent: "center",
      alignItems: "center",
    },
    bookedCell: {
      backgroundColor: colors.primary,
    },
    todayCell: {
      borderWidth: 2,
      borderColor: colors.primary,
    },
    dayNumber: { fontSize: 14, fontWeight: "500", color: colors.text },
    dayNotInMonth: {
      opacity: 0,
    },
    bookedDayNumber: {
      color: colors.background,
      fontWeight: "bold",
    },
    todayDayNumber: {
      color: colors.primary,
      fontWeight: "bold",
    },
  });

export default CalendarScreen;
