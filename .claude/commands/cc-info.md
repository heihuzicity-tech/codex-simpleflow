# cc-info
Configure project information and initialize workflow system.

REQUIRED: Create `.specs/project-info.md` with project details
REQUIRED: Configure `.gitignore` entries if needed
REQUIRED: Include project description, technology stack, key requirements
REQUIRED: Establish project baseline for feature development

PROHIBITED: Proceeding without complete project information
PROHIBITED: Missing essential project context

Project Info Structure:
```
# Project Information
Name: {project_name}
Description: {brief_description}
Tech Stack: {technologies}
Key Directories: {directory_list}
Development Environment: {environment_info}
```

Setup Sequence:
1. Gather project information from user
2. Create structured project-info.md
3. Configure .gitignore if needed
4. Validate information completeness