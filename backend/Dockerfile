# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY BookStation/BookStation.API/*.csproj ./BookStation/BookStation.API/
RUN dotnet restore ./BookStation/BookStation.API/BookStation.API.csproj

# Copy everything else and build
COPY BookStation/ ./BookStation/
WORKDIR /src/BookStation/BookStation.API
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create wwwroot/uploads directory
RUN mkdir -p /app/wwwroot/uploads/products

# Copy published app
COPY --from=publish /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "BookStation.API.dll"]

