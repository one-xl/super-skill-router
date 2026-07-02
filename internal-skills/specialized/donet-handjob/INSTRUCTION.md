---
name: donet-handjob
description: Convert or refactor .NET Windows desktop projects, especially WPF or WinForms course projects, to look and feel like pure Visual Studio drag-and-drop visual programming assignments. Use when a teacher asks to make a C#/.NET desktop app look more like a Visual Studio designer-built artifact for students, final coursework, curriculum demos, or visual programming examples while preserving the existing business logic.
---

# Donet Handjob

## Goal

Transform an existing .NET desktop project into a teaching-friendly visual programming artifact: conventional controls, obvious designer hierarchy, named controls, event-handler entry points, and simple documentation that students can inspect in Visual Studio.

Preserve working business logic. Change the presentation and project shape only as far as needed to make it look like a Visual Studio drag-and-drop project.

## Workflow

1. Inspect the project type.
   - Prefer WPF, WinForms, WinUI, or MAUI Windows desktop projects.
   - Identify the startup project, main window/form, designer/XAML files, code-behind, view models, and shared styles.
   - Check `git status` before editing and avoid reverting unrelated user changes.

2. Keep the app runnable.
   - Do not replace the app with screenshots, mockups, or static pages.
   - Do not remove existing data access, grading, CRUD, exam, AI, or workflow logic unless the user explicitly asks.
   - Route new visual controls to existing commands/services instead of duplicating business logic.

3. Make the UI look designer-built.
   - Use conventional desktop controls: `Menu`, `MenuItem`, `StatusBar`, `TabControl`, `TabItem`, `GroupBox`, `Label`, `TextBox`, `ComboBox`, `CheckBox`, `RadioButton`, `Button`, `DataGrid`, `ListBox`, `TreeView`, `ToolStrip`, `MenuStrip`, and `StatusStrip`.
   - Prefer visible form sections over highly custom modern panels when the user asks for "pure Visual Studio drag controls".
   - Add meaningful `x:Name` / `Name` values to important controls so students can find them in the designer and code-behind.
   - Keep button sets non-redundant. If a page already has a functional button, do not add another toolbar button for the same action unless the user asks for shortcuts.
   - Keep text boxes readable: set explicit `Height`/`MinHeight` for multi-line fields, preserve scrollbars, and avoid templates that clip `PART_ContentHost`.

4. Add code-behind event entry points where pedagogically useful.
   - For WPF, it is acceptable to add small `Click` handlers that call existing `ICommand`s.
   - For WinForms, use designer-style event handlers such as `buttonSave_Click`.
   - Keep handlers thin: select the right tab, perform light UI state setup, then call existing command/service logic.
   - Do not move large business workflows into code-behind just to look traditional.

5. Simplify advanced visual styling.
   - Remove or reduce decorative animation, complex custom templates, and heavily themed controls if they make the project look hand-crafted rather than designer-built.
   - Preserve accessibility and readability.
   - Avoid adding duplicate command surfaces that clutter the UI.

6. Document the visual-programming mapping.
   - Add or update a concise doc such as `docs/VisualProgrammingGuide.md`.
   - Include a table mapping toolbox controls to actual files/control names.
   - Mention which operations use event handlers and which use command binding.
   - Include a short student demo flow and final build command.

7. Validate.
   - Build the solution with the repo's normal command, usually `dotnet build <solution> -c Debug` or `Release`.
   - If build output is locked by a running app, explain that the app process must be closed and validate another configuration when possible.
   - Report changed files and any remaining visual risks.

## WPF Patterns

Use these patterns when modifying WPF projects:

- Add `d:DataContext` to main XAML when it helps Visual Studio designer inspection.
- Use `DockPanel` or `Grid` to place `Menu` at the top and `StatusBar` at the bottom.
- Use `TabControl` for major modules in student projects: management, exam/practice, wrong-book, reports, AI, settings.
- Use `GroupBox` and `Label` around forms to resemble designer composition.
- Name important controls: `MainMenu`, `MainStatusBar`, `QuestionBankTabItem`, `QuestionDataGrid`, `SaveQuestionButton`, `StatusTextBlock`.
- Keep global `TextBox` templates compatible with multi-line fields:

```xml
<ScrollViewer x:Name="PART_ContentHost"
              Margin="{TemplateBinding Padding}"
              HorizontalScrollBarVisibility="{TemplateBinding HorizontalScrollBarVisibility}"
              VerticalScrollBarVisibility="{TemplateBinding VerticalScrollBarVisibility}" />
```

Thin code-behind wrapper example:

```csharp
private void MenuRefreshBank_OnClick(object sender, RoutedEventArgs e)
{
    ExecuteDesignerCommand((DataContext as MainWindowViewModel)?.RefreshBankCommand);
}
```

## WinForms Patterns

Use these patterns when modifying WinForms projects:

- Prefer `MenuStrip`, `ToolStrip` only when it does not duplicate page buttons, `StatusStrip`, `TabControl`, `GroupBox`, `DataGridView`, `Label`, `TextBox`, `ComboBox`, and `Button`.
- Keep generated `.Designer.cs` structure stable where possible.
- Place logic in services or controller classes; keep form event handlers short.
- Use predictable names: `menuStripMain`, `statusStripMain`, `tabPageQuestionBank`, `dataGridViewQuestions`, `buttonSaveQuestion`.

## Anti-Patterns

- Do not add a second row of shortcut buttons when the page already has the same buttons.
- Do not break MVVM or service layering by copying large workflows into event handlers.
- Do not redesign the app into a modern web-like dashboard if the request is Visual Studio drag-and-drop style.
- Do not remove core course requirements such as database persistence, CRUD, exam flow, grading, wrong-book loop, or AI extension points.
- Do not leave clipped text boxes, unreadable combo boxes, or controls that resize unpredictably.
- Do not create extra docs beyond what is useful for the course handoff.
