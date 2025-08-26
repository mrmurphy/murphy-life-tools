(() => {
    const planData = {
        foundation: {
            A: [
                { name: "Bench Press", sets: 3, reps: 10 },
                { name: "Seated Cable Row", sets: 3, reps: 10 },
                { name: "Goblet Squat", sets: 3, reps: 12 },
                {
                    name: "Romanian Deadlift (DB)",
                    sets: 3,
                    reps: 10,
                },
                { name: "Plank", sets: 2, reps: "20-30s" },
                {
                    name: "Farmer's Walk",
                    sets: 2,
                    reps: "30 yards",
                },
            ],
            B: [
                { name: "DB Shoulder Press", sets: 3, reps: 10 },
                { name: "TRX/Ring Rows", sets: 3, reps: 10 },
                { name: "Bodyweight Squats", sets: 3, reps: 15 },
                { name: "Glute Bridges", sets: 3, reps: 12 },
                { name: "Dead Bug", sets: 2, reps: "8 each" },
                { name: "Sled Push", sets: 2, reps: "20 yards" },
            ],
        },
        progression: {
            A: [
                { name: "Bench Press", sets: 3, reps: 8 },
                { name: "Seated Cable Row", sets: 3, reps: 8 },
                { name: "Back Squat (light)", sets: 3, reps: 8 },
                {
                    name: "Romanian Deadlift (BB)",
                    sets: 3,
                    reps: 8,
                },
                { name: "Plank", sets: 2, reps: "30-45s" },
                {
                    name: "Farmer's Walk",
                    sets: 2,
                    reps: "40 yards",
                },
            ],
            B: [
                { name: "DB Shoulder Press", sets: 3, reps: 8 },
                {
                    name: "Assisted Pull-ups or Lat Pulldowns",
                    sets: 3,
                    reps: "6-8",
                },
                {
                    name: "Walking Lunges",
                    sets: 3,
                    reps: "8 each leg",
                },
                { name: "KB Swings (light)", sets: 3, reps: 12 },
                {
                    name: "Side Plank",
                    sets: 2,
                    reps: "15-20s each side",
                },
                { name: "Sled Push", sets: 2, reps: "30 yards" },
            ],
        },
    };

    const now = new Date();
    let targetYear =
        now.getMonth() < 8
            ? now.getFullYear()
            : now.getFullYear() + 1;

    let workoutState = JSON.parse(
        localStorage.getItem("workoutState") || "{}",
    );

    function saveWorkoutState() {
        try {
            localStorage.setItem(
                "workoutState",
                JSON.stringify(workoutState),
            );
        } catch (e) {
            console.error("Failed to save state:", e);
        }
    }

    let currentTab = "incomplete";
    function showTab(tabName) {
        currentTab = tabName;
        const cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            if (card.dataset.status === tabName)
                card.style.display = "block";
            else card.style.display = "none";
        });
        const tabButtons = document.querySelectorAll(".tab-btn");
        tabButtons.forEach((btn) => {
            if (btn.dataset.tab === tabName)
                btn.classList.add("active");
            else btn.classList.remove("active");
        });
    }

    function generateDayCard(dateObj, dayNumber) {
        const month = dateObj.getMonth();
        const isoDate = `${dateObj.getFullYear()}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
        const weekday = dateObj.getDay();
        let workoutType;
        if (weekday === 1 || weekday === 3 || weekday === 5)
            workoutType = "A";
        else if (weekday === 2 || weekday === 4) workoutType = "B";
        else workoutType = "Rest";

        const phase =
            dayNumber <= 14 ? "foundation" : "progression";
        const exercisesPlan =
            workoutType === "Rest"
                ? []
                : planData[phase][workoutType];

        let dayState = workoutState[isoDate];
        if (!dayState) {
            dayState = {
                completed: false,
                energyLevel: 5,
                exercises: {},
            };
            workoutState[isoDate] = dayState;
            saveWorkoutState();
        }

        const card = document.createElement("div");
        card.className = "card";
        card.dataset.status = dayState.completed
            ? "completed"
            : "incomplete";

        // Header
        const header = document.createElement("h2");
        const dateStr = dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
        header.textContent = `${dateStr} - ${workoutType === "Rest" ? "Rest Day" : `Workout ${workoutType}`}`;
        card.appendChild(header);

        // Completed checkbox and cancel button
        const completedLabel = document.createElement("label");
        completedLabel.style.display = "flex";
        completedLabel.style.alignItems = "center";
        const completedCheckbox = document.createElement("input");
        completedCheckbox.type = "checkbox";
        completedCheckbox.checked = dayState.completed;
        completedCheckbox.addEventListener("change", (e) => {
            dayState.completed = e.target.checked;
            card.dataset.status = dayState.completed
                ? "completed"
                : "incomplete";
            if (card._cancelBtn)
                card._cancelBtn.style.display = dayState.completed
                    ? "none"
                    : "inline-block";
            saveWorkoutState();
            showTab(currentTab);
        });
        completedLabel.appendChild(completedCheckbox);
        completedLabel.appendChild(
            document.createTextNode(" Completed"),
        );

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel Workout";
        cancelBtn.className = "cancel-btn";
        cancelBtn.style.marginLeft = "1rem";
        cancelBtn.addEventListener("click", () => {
            dayState.completed = true;
            completedCheckbox.checked = true;
            card.dataset.status = "completed";
            if (card._cancelBtn)
                card._cancelBtn.style.display = "none";
            saveWorkoutState();
            showTab(currentTab);
        });
        cancelBtn.style.display =
            workoutType !== "Rest" && !dayState.completed
                ? "inline-block"
                : "none";

        const actionDiv = document.createElement("div");
        actionDiv.style.display = "flex";
        actionDiv.style.alignItems = "center";
        actionDiv.appendChild(completedLabel);
        actionDiv.appendChild(cancelBtn);
        card.appendChild(actionDiv);
        card._cancelBtn = cancelBtn;

        // Energy level input for non-rest days
        if (workoutType !== "Rest") {
            const energyDiv = document.createElement("div");
            energyDiv.style.display = "flex";
            energyDiv.style.alignItems = "center";
            energyDiv.style.marginTop = "0.5rem";

            const energyLabel = document.createElement("span");
            energyLabel.textContent = `Energy Level (${dayState.energyLevel})`;
            energyLabel.style.marginRight = "0.5rem";
            energyDiv.appendChild(energyLabel);

            const energyInput = document.createElement("input");
            energyInput.type = "number";
            energyInput.min = "1";
            energyInput.max = "10";
            energyInput.step = "1";
            energyInput.inputMode = "numeric";
            energyInput.value = dayState.energyLevel;
            energyInput.addEventListener("change", (e) => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) val = 1;
                if (val > 10) val = 10;
                dayState.energyLevel = val;
                energyLabel.textContent = `Energy Level (${dayState.energyLevel})`;
                saveWorkoutState();
            });
            energyDiv.appendChild(energyInput);
            card.appendChild(energyDiv);
        }

        // Exercises table
        if (exercisesPlan.length > 0) {
            const table = document.createElement("table");
            table.className = "exercise-table";
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            [
                "Exercise",
                "Sets x Reps",
                "Weight (lbs)",
                "Notes",
            ].forEach((text) => {
                const th = document.createElement("th");
                th.textContent = text;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement("tbody");

            exercisesPlan.forEach((ex) => {
                const tr = document.createElement("tr");
                // Exercise name
                const tdName = document.createElement("td");
                tdName.textContent = ex.name;
                tr.appendChild(tdName);
                // Sets x Reps
                const tdSetsReps = document.createElement("td");
                tdSetsReps.textContent = `${ex.sets}x${ex.reps}`;
                tr.appendChild(tdSetsReps);

                // Weight input
                const tdWeight = document.createElement("td");
                const weightInput = document.createElement("input");
                weightInput.type = "number";
                weightInput.step = "0.5";
                weightInput.min = "0";
                weightInput.inputMode = "decimal";
                weightInput.placeholder = "Weight (lbs)";
                const saved = dayState.exercises[ex.name];
                if (saved && typeof saved.weight !== "undefined") {
                    weightInput.value = saved.weight;
                }
                weightInput.addEventListener("change", (e) => {
                    const val = parseFloat(e.target.value);
                    if (!dayState.exercises[ex.name])
                        dayState.exercises[ex.name] = {};
                    if (!isNaN(val))
                        dayState.exercises[ex.name].weight = val;
                    else delete dayState.exercises[ex.name].weight;
                    saveWorkoutState();
                });
                tdWeight.appendChild(weightInput);
                tr.appendChild(tdWeight);

                // Notes textarea
                const tdNotes = document.createElement("td");
                const notesInput =
                    document.createElement("textarea");
                notesInput.rows = "1";
                notesInput.placeholder = "Notes";
                if (saved && typeof saved.notes !== "undefined") {
                    notesInput.value = saved.notes;
                }
                notesInput.addEventListener("input", (e) => {
                    const val = notesInput.value.trim();
                    if (!dayState.exercises[ex.name])
                        dayState.exercises[ex.name] = {};
                    if (val)
                        dayState.exercises[ex.name].notes = val;
                    else delete dayState.exercises[ex.name].notes;
                    saveWorkoutState();
                });
                tdNotes.appendChild(notesInput);
                tr.appendChild(tdNotes);

                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            card.appendChild(table);
        }

        return card;
    }

    // Render all days
    const container = document.getElementById("workoutContainer");
    for (let day = 1; day <= 30; day++) {
        const dateObj = new Date(targetYear, 8, day); // September month index 8
        const card = generateDayCard(dateObj, day);
        container.appendChild(card);
    }
    showTab(currentTab);

    // Tab button handlers
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () =>
            showTab(btn.dataset.tab),
        );
    });

    // Export / Import / Reset
    const exportBtn = document.getElementById("exportBtn");
    exportBtn.addEventListener("click", () => {
        const dataStr = JSON.stringify(workoutState, null, 2);
        const blob = new Blob([dataStr], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const dateNow = new Date();
        const filename = `workout_state_${dateNow.getFullYear()}${String(dateNow.getMonth() + 1).padStart(2, "0")}${String(dateNow.getDate()).padStart(2, "0")}.json`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    const importBtn = document.getElementById("importBtn");
    const fileInput = document.getElementById("importFileInput");

    importBtn.addEventListener("click", () => {
        fileInput.value = "";
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        if (!e.target.files.length) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (evt) {
            try {
                const imported = JSON.parse(evt.target.result);
                if (
                    typeof imported === "object" &&
                    imported !== null
                ) {
                    workoutState = imported;
                    localStorage.setItem(
                        "workoutState",
                        JSON.stringify(workoutState),
                    );
                    location.reload();
                } else throw new Error("Invalid format");
            } catch (err) {
                alert("Failed to import: " + err.message);
            }
        };
        reader.readAsText(file);
    });

    const resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all data?")) {
            localStorage.removeItem("workoutState");
            location.reload();
        }
    });
})();
